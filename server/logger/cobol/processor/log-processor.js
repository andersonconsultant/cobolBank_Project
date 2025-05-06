const { spawn } = require('child_process');
const crypto = require('crypto');
const express = require('express');
const router = express.Router();

// Configuração do logger
const LOG_TYPES = {
    COBOL: 'COBOL',
    FRONTEND: 'FRONTEND',
    BACKEND: 'BACKEND'
};

// Cache de trace IDs
const traceCache = new Map();

class LogProcessor {
    constructor() {
        this.cobolProcess = null;
        this.isConnected = false;
        this.commandQueue = [];
        this.processingCommand = false;
    }

    // Processa a fila de comandos
    async processCommandQueue() {
        if (this.processingCommand || this.commandQueue.length === 0) {
            return;
        }

        this.processingCommand = true;
        const { command, resolve, reject } = this.commandQueue.shift();

        try {
            // Se for um comando LOG, precisa enviar "LOG" primeiro
            if (command.includes(';')) {
                console.log('\n→ Enviando comando LOG');
                this.cobolProcess.stdin.write('LOG\n');
                
                // Aguarda resposta do prompt do COBOL
                await new Promise(r => setTimeout(r, 100));
                
                console.log('→ Enviando dados:', command);
                this.cobolProcess.stdin.write(command + '\n');
            } else {
                console.log('\n→ Executando comando:', command);
                this.cobolProcess.stdin.write(command + '\n');
            }

            // Aguarda resposta do COBOL
            await new Promise(r => setTimeout(r, 1000));
            
            this.processingCommand = false;
            resolve(true);

            // Processa próximo comando se houver
            if (this.commandQueue.length > 0) {
                this.processCommandQueue();
            }
        } catch (error) {
            console.error('Erro ao executar comando:', error);
            this.processingCommand = false;
            reject(error);
        }
    }

    // Enfileira um comando
    async enqueueCommand(command) {
        return new Promise((resolve, reject) => {
            this.commandQueue.push({ command, resolve, reject });
            this.processCommandQueue();
        });
    }

    // Gera ou recupera o trace_id para uma operação
    getTraceId(logData) {
        const operationKey = `${logData.session_id}:${logData.endpoint}:${logData.method}`;
        
        if (!traceCache.has(operationKey)) {
            const trace_id = crypto.randomBytes(8).toString('hex');
            traceCache.set(operationKey, trace_id);
            
            setTimeout(() => {
                traceCache.delete(operationKey);
            }, 5 * 60 * 1000);
            
            return trace_id;
        }
        
        return traceCache.get(operationKey);
    }

    // Inicializa a conexão com o COBOL
    async initialize() {
        console.log('=== Iniciando processador de logs ===\n');
        
        this.cobolProcess = spawn('./bin/Enginev4TST', [], { 
            cwd: '/srv/cb_Project/Rules/api/cobol/DEV',
            stdio: ['pipe', 'pipe', 'pipe']
        });

        // Processar erros do COBOL
        this.cobolProcess.stderr.on('data', (data) => {
            console.error('Erro COBOL:', data.toString());
        });

        // Processar saída do COBOL
        this.cobolProcess.stdout.on('data', (data) => {
            this.processCobolOutput(data.toString());
        });

        // Iniciar conexão com o banco
        try {
            const connected = await this.enqueueCommand('START');
            this.isConnected = connected;
            
            if (connected) {
                console.log('✓ Processador de logs inicializado e conectado ao banco');
            } else {
                console.error('✖ Falha ao conectar com o banco');
            }
            
            return connected;
        } catch (error) {
            console.error('Erro ao inicializar:', error);
            return false;
        }
    }

    // Processa a saída do COBOL
    processCobolOutput(line) {
        const trimmedLine = line.trim();
        if (!trimmedLine) return;

        console.log('Saída COBOL:', trimmedLine);

        // Processa resultado de busca
        if (trimmedLine.startsWith('result\\')) {
            const resultData = trimmedLine.substring(7).split(';').map(item => item.trim());
            console.log('\n✓ Resultado da busca:');
            console.log({
                session_id: resultData[0],
                component: resultData[1],
                action: resultData[2],
                status: resultData[3],
                response_time: resultData[4],
                message: resultData[5],
                endpoint: resultData[6],
                method: resultData[7],
                value: resultData[8],
                created_at: resultData[9]
            });
            return;
        }

        // Processa log normal
        if (trimmedLine.startsWith('log\\')) {
            const logData = trimmedLine.substring(4).split(';').map(item => item.trim());
            console.log('\n✓ Log processado e salvo no banco:');
            console.log({
                session_id: logData[0],
                component: logData[1],
                action: logData[2],
                status: logData[3],
                response_time: logData[4],
                message: logData[5],
                endpoint: logData[6],
                method: logData[7],
                value: logData[8]
            });
            console.log('-------------------');
            return;
        }

        if (trimmedLine.includes('\\')) {
            const [key, value] = trimmedLine.split('\\');
            if (key.trim() === '1') {
                console.log(`✓ COBOL Status: ${value.trim()}`);
                if (value.trim().includes('Conexao com o banco iniciada')) {
                    this.isConnected = true;
                }
            } else if (key.trim() === '0') {
                console.log(`✖ COBOL Error: ${value.trim()}`);
                if (value.trim().includes('Conexao com o banco')) {
                    this.isConnected = false;
                }
            }
        }
    }

    // Processa um log recebido
    async processLog(logData) {
        if (!this.isConnected) {
            console.error('✖ Processador não está conectado ao banco');
            return false;
        }

        try {
            // Ignora logs de assets estáticos
            if (this.isStaticAsset(logData.endpoint)) {
                return true;
            }

            console.log('\n=== Processando Log ===');
            console.log('Dados recebidos:', JSON.stringify(logData, null, 2));

            // Adiciona ou recupera o trace_id
            logData.trace_id = this.getTraceId(logData);
            console.log('Trace ID:', logData.trace_id);

            // Formata os dados
            const logString = this.formatLogString(logData);
            console.log('String formatada:', logString);

            // Envia os dados diretamente - o processCommandQueue vai cuidar da sequência LOG + dados
            const dataSent = await this.enqueueCommand(logString);
            if (!dataSent) {
                console.error('✖ Falha ao enviar dados do log');
                return false;
            }

            console.log('✓ Log enviado com sucesso');
            return true;
        } catch (error) {
            console.error('✖ Erro ao processar log:', error);
            return false;
        }
    }

    // Verifica se é um asset estático
    isStaticAsset(endpoint) {
        const staticExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.eot'];
        return staticExtensions.some(ext => endpoint.toLowerCase().endsWith(ext));
    }

    // Formata o log para o formato esperado pelo COBOL
    formatLogString(data) {
        // Validação dos campos obrigatórios
        const requiredFields = [
            'session_id',
            'component',
            'action',
            'status',
            'response_time',
            'message',
            'endpoint',
            'method',
            'value'
        ];

        requiredFields.forEach(field => {
            if (!data[field]) {
                console.warn(`⚠ Campo ${field} está vazio ou nulo`);
            }
        });

        // Trunca campos para corresponder ao tamanho das colunas no banco
        const truncatedSessionId = data.session_id.substring(0, 10);      // varchar(10)
        const truncatedComponent = data.component.substring(0, 10);       // varchar(10)
        const truncatedAction = data.action.substring(0, 10);            // varchar(10)
        const truncatedStatus = data.status.substring(0, 10);            // varchar(10)
        const truncatedMessage = data.message.substring(0, 100);         // varchar(100)
        const truncatedEndpoint = data.endpoint.substring(0, 30);        // varchar(30)
        const truncatedMethod = data.method.substring(0, 10);            // varchar(10)
        
        // Formata a string com campos truncados conforme especificação do banco
        const logString = `${truncatedSessionId};${truncatedComponent};${truncatedAction};${truncatedStatus};${data.response_time};${truncatedMessage};${truncatedEndpoint};${truncatedMethod};${data.value}`;
        return logString;
    }

    // Finaliza o processador
    async shutdown() {
        if (this.cobolProcess) {
            try {
                await this.enqueueCommand('EXIT');
                this.cobolProcess.kill();
                console.log('✓ Processador de logs finalizado');
            } catch (error) {
                console.error('Erro ao finalizar:', error);
            }
        }
    }

    // Consulta logs com filtros
    async queryLogs(filters = {}) {
        if (!this.isConnected) {
            throw new Error('Processador não está conectado ao banco');
        }

        try {
            // Envia comando SEARCH para o COBOL
            await this.enqueueCommand('SEARCH');
            
            // Envia os filtros um por um
            if (filters.session_id) {
                await this.enqueueCommand(`SESSION ${filters.session_id}`);
            }
            if (filters.status) {
                await this.enqueueCommand(`STATUS ${filters.status}`);
            }
            if (filters.endpoint) {
                await this.enqueueCommand(`ENDPOINT ${filters.endpoint}`);
            }
            if (filters.start_date) {
                await this.enqueueCommand(`DATE_FROM ${filters.start_date}`);
            }
            if (filters.end_date) {
                await this.enqueueCommand(`DATE_TO ${filters.end_date}`);
            }

            // Executa a busca
            const result = await this.enqueueCommand('EXECUTE');
            return result;
        } catch (error) {
            console.error('Erro ao consultar logs:', error);
            throw error;
        }
    }
}

// Cria uma única instância do processador
const logProcessor = new LogProcessor();

// Configuração do Express Router
router.get('/api/log', async (req, res) => {
    try {
        const filters = {
            session_id: req.query.session_id,
            status: req.query.status,
            endpoint: req.query.endpoint,
            start_date: req.query.start_date,
            end_date: req.query.end_date
        };

        await logProcessor.queryLogs(filters);
        res.json({
            success: true,
            message: 'Consulta realizada com sucesso'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Mantém a exportação original do logProcessor para compatibilidade
module.exports = logProcessor;

// Adiciona exports adicionais
module.exports.router = router;

// Se executado diretamente, roda o teste
if (require.main === module) {
    // Função de teste
    async function runTest() {
        try {
            await logProcessor.initialize();

            // Simula uma sequência de logs para a mesma operação
            const sessionId = "12345";
            const endpoint = "/api/v1/test";
            const method = "POST";

            // Log inicial
            const initialLog = {
                session_id: sessionId,
                component: "BACKEND",
                action: "REQUEST",
                status: "STARTED",
                response_time: "0",
                message: "Iniciando requisição",
                endpoint: endpoint,
                method: method,
                value: "1500.75"
            };
            await logProcessor.processLog(initialLog);

            // Log de processamento
            const processingLog = {
                session_id: sessionId,
                component: "BACKEND",
                action: "PROCESS",
                status: "PENDING",
                response_time: "50",
                message: "Processando requisição",
                endpoint: endpoint,
                method: method,
                value: "1500.75"
            };
            await logProcessor.processLog(processingLog);

            // Log de conclusão
            const completionLog = {
                session_id: sessionId,
                component: "BACKEND",
                action: "RESPONSE",
                status: "OK",
                response_time: "100",
                message: "Requisição concluída",
                endpoint: endpoint,
                method: method,
                value: "1500.75"
            };
            await logProcessor.processLog(completionLog);

            await logProcessor.shutdown();
            process.exit(0);
        } catch (error) {
            console.error('Erro durante o teste:', error);
            process.exit(1);
        }
    }

    runTest();
} 