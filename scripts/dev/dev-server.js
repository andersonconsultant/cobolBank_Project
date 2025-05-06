const { spawn } = require('child_process');
const { logInfo, logError, logWarn } = require('../../Rules/api/utils/logger');
const net = require('net');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const config = require('../../config');
const loggerConfig = require('../../Rules/api/utils/logger/loggerConfig');

// Configuração de cores para os processos
const COLORS = loggerConfig.console.colors;
const delay = loggerConfig.cobol.retryDelay || 1000; // Definindo a constante delay

// Verifica se uma porta está em uso
function isPortInUse(port) {
    return new Promise((resolve) => {
        const server = net.createServer()
            .once('error', () => resolve(true))
            .once('listening', () => {
                server.close();
                resolve(false);
            })
            .listen(port);
    });
}

// Função para criar um processo com output colorido
function createProcess(name, command, args, color, env = {}) {
    const proc = spawn(command, args, {
        stdio: 'pipe',
        shell: true,
        env: {
            ...process.env,
            FORCE_COLOR: true,
            NODE_ENV: 'development',
            ...env
        }
    });

    // Prefix para os logs
    const prefix = `${color}[${name}]${COLORS.RESET}`;

    // Stream de stdout
    proc.stdout.on('data', (data) => {
        data.toString().split('\n').forEach(line => {
            if (line.trim()) {
                console.log(`${prefix} ${line.trim()}`);
            }
        });
    });

    // Stream de stderr
    proc.stderr.on('data', (data) => {
        data.toString().split('\n').forEach(line => {
            if (line.trim()) {
                console.error(`${prefix} ${line.trim()}`);
            }
        });
    });

    // Tratamento de erros
    proc.on('error', (error) => {
        logError(error);
    });

    return proc;
}

// Função para tentar matar processos em uma porta específica
async function killProcessOnPort(port) {
    return new Promise((resolve) => {
        const kill = spawn('lsof', ['-i', `:${port}`, '-t']);
        kill.stdout.on('data', (data) => {
            const pid = data.toString().trim();
            if (pid) {
                try {
                    process.kill(parseInt(pid));
                    logWarn(`Processo na porta ${port} (PID: ${pid}) foi encerrado`);
                } catch (e) {
                    logError(new Error(`Não foi possível encerrar o processo ${pid}: ${e.message}`));
                }
            }
        });
        kill.on('close', resolve);
    });
}

// Função para verificar se o servidor de logs está pronto
async function waitForLogServer() {
    const maxAttempts = loggerConfig.cobol.maxRetries;
    const delay = loggerConfig.cobol.retryDelay;
    const port = process.env.LOG_SERVER_PORT || loggerConfig.server.port;

    for (let i = 0; i < maxAttempts; i++) {
        try {
            logInfo(`Verificando servidor de logs na porta ${port} (tentativa ${i + 1}/${maxAttempts})...`);
            const response = await fetch(`http://localhost:${port}/health`);
            
            if (response.ok) {
                const data = await response.json();
                if (data.status === 'ok') {
                    logInfo(`Servidor de logs detectado na porta ${port}`);
                    return true;
                }
            }
        } catch (error) {
            // Ignora erro e tenta novamente
        }
        await new Promise(resolve => setTimeout(resolve, delay));
    }
    return false;
}

// Função principal
async function startDev() {
    logInfo('🚀 Iniciando ambiente de desenvolvimento...');

    // Verifica e libera as portas necessárias
    const ports = [
        config.ports.frontend,
        config.ports.backend,
        config.ports.cobol,
        loggerConfig.server.port
    ];

    for (const port of ports) {
        if (await isPortInUse(port)) {
            logWarn(`Porta ${port} em uso. Tentando liberar...`);
            await killProcessOnPort(port);
            // Aguarda um momento para a porta ser liberada
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    // Inicia o frontend primeiro (não depende mais do COBOL)
    logInfo('📱 Iniciando frontend...');
    const frontend = createProcess(
        'FRONTEND',
        'npm',
        ['run', 'start:frontend'],
        COLORS.FRONTEND
    );

    // Inicia o backend Node.js
    logInfo('🔧 Iniciando backend...');
    const backend = createProcess(
        'BACKEND',
        'npm',
        ['run', 'start:backend'],
        COLORS.BACKEND
    );

    // Inicia o backend COBOL em background
    logInfo('🔄 Iniciando COBOL em background...');
    const cobolBackend = createProcess(
        'COBOL',
        'cd Rules/api && node index.js',
        [],
        COLORS.COBOL,
        { 
            PORT: config.ports.cobol.toString(), 
            BACKEND_ONLY: 'true',
            COBOL_LAZY_LOAD: 'true' // Nova flag para lazy loading
        }
    );

    // Gerenciamento de encerramento
    process.on('SIGINT', () => {
        logInfo('Encerrando processos...');
        frontend.kill();
        backend.kill();
        cobolBackend.kill();
        process.exit(0);
    });

    // Monitoramento de processos
    const handleProcessExit = (name, proc, code) => {
        if (code !== null && code !== 0) {
            logError(new Error(`${name} encerrado com código ${code}`));
            // Não encerra outros processos se COBOL falhar
            if (name !== 'COBOL') {
                frontend.kill();
                backend.kill();
                cobolBackend.kill();
                process.exit(1);
            }
        }
    };

    frontend.on('exit', (code) => handleProcessExit('Frontend', frontend, code));
    backend.on('exit', (code) => handleProcessExit('Backend', backend, code));
    cobolBackend.on('exit', (code) => handleProcessExit('COBOL', cobolBackend, code));

    // Exibe informações úteis
    logInfo(`
🌐 Serviços disponíveis:
   Frontend: http://localhost:${config.ports.frontend}
   Backend API: http://localhost:${config.ports.backend}/api
   COBOL API: http://localhost:${config.ports.cobol}/api
   Logger: http://localhost:${loggerConfig.server.port}
   Métricas: http://localhost:${config.ports.backend}/_metrics

💡 Dicas:
   - Frontend e arquivos estáticos funcionam independentemente do COBOL
   - COBOL será inicializado apenas quando necessário
   - Use /_metrics para monitorar o estado dos serviços
   - Pressione Ctrl+C para encerrar todos os serviços
`);
}

// Inicia o ambiente de desenvolvimento
startDev().catch(error => {
    logError(error);
    process.exit(1);
}); 