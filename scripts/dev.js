const { spawn } = require('child_process');
const { logInfo, logError, logWarn } = require('./logger');
const net = require('net');

// Configuração de cores para os processos
const COLORS = {
    FRONTEND: '\x1b[36m', // Cyan
    BACKEND: '\x1b[35m',  // Magenta
    SYSTEM: '\x1b[32m',   // Green
    RESET: '\x1b[0m'
};

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
function createProcess(name, command, args, color) {
    const proc = spawn(command, args, {
        stdio: 'pipe',
        shell: true,
        env: {
            ...process.env,
            FORCE_COLOR: true,
            NODE_ENV: 'development'
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

// Função principal
async function startDev() {
    logInfo('🚀 Iniciando ambiente de desenvolvimento...');

    // Verifica e libera as portas necessárias
    const ports = [3000, 3001];
    for (const port of ports) {
        if (await isPortInUse(port)) {
            logWarn(`Porta ${port} em uso. Tentando liberar...`);
            await killProcessOnPort(port);
            // Aguarda um momento para a porta ser liberada
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    // Inicia o backend
    const backend = createProcess(
        'BACKEND',
        'npm',
        ['run', 'start:backend'],
        COLORS.BACKEND
    );

    // Aguarda um pouco para garantir que o backend iniciou
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Inicia o frontend
    const frontend = createProcess(
        'FRONTEND',
        'npm',
        ['run', 'start:frontend'],
        COLORS.FRONTEND
    );

    // Gerenciamento de encerramento
    process.on('SIGINT', () => {
        logInfo('Encerrando processos...');
        backend.kill();
        frontend.kill();
        process.exit(0);
    });

    // Monitoramento de processos
    backend.on('exit', (code) => {
        if (code !== null && code !== 0) {
            logError(new Error(`Backend encerrado com código ${code}`));
            frontend.kill();
            process.exit(1);
        }
    });

    frontend.on('exit', (code) => {
        if (code !== null && code !== 0) {
            logError(new Error(`Frontend encerrado com código ${code}`));
            backend.kill();
            process.exit(1);
        }
    });

    // Exibe informações úteis
    logInfo('🌐 Endpoints disponíveis:');
    console.log(`${COLORS.SYSTEM}Frontend: http://localhost:3000`);
    console.log(`Backend:  http://localhost:3001/api${COLORS.RESET}`);
    
    logInfo('📝 Logs:');
    console.log(`${COLORS.SYSTEM}→ Requisições em Cyan`);
    console.log(`← Respostas em Verde`);
    console.log(`⚙ Operações COBOL em Magenta`);
    console.log(`✖ Erros em Vermelho${COLORS.RESET}`);
}

// Inicia o ambiente de desenvolvimento
startDev().catch(error => {
    logError(error);
    process.exit(1);
}); 