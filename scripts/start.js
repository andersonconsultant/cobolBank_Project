const { spawn } = require('child_process');

// Cores para os logs
const COLORS = {
    SYSTEM: '\x1b[32m',  // Verde
    BACKEND: '\x1b[35m', // Magenta
    FRONTEND: '\x1b[36m' // Cyan
};

function log(type, message) {
    const color = COLORS[type] || COLORS.SYSTEM;
    console.log(`${color}[${type}] ${message}\x1b[0m`);
}

function startService(name, command, args) {
    const process = spawn(command, args, {
        stdio: 'pipe',
        shell: true,
        cwd: process.cwd()
    });

    process.stdout.on('data', data => {
        data.toString().split('\n').forEach(line => {
            if (line.trim()) log(name, line.trim());
        });
    });

    process.stderr.on('data', data => {
        data.toString().split('\n').forEach(line => {
            if (line.trim()) log(name, line.trim());
        });
    });

    return process;
}

// Inicia os serviços
log('SYSTEM', 'Iniciando serviços...');

// Inicia o backend
const backend = startService('BACKEND', 'npm', ['run', 'dev:backend']);

// Aguarda 2 segundos e inicia o frontend
setTimeout(() => {
    const frontend = startService('FRONTEND', 'npm', ['run', 'dev:frontend']);

    // Gerencia o encerramento
    process.on('SIGINT', () => {
        log('SYSTEM', 'Encerrando serviços...');
        backend.kill();
        frontend.kill();
        process.exit(0);
    });

    // Monitora os processos
    backend.on('exit', code => {
        if (code !== null) {
            log('SYSTEM', `Backend encerrado com código ${code}`);
            frontend.kill();
            process.exit(1);
        }
    });

    frontend.on('exit', code => {
        if (code !== null) {
            log('SYSTEM', `Frontend encerrado com código ${code}`);
            backend.kill();
            process.exit(1);
        }
    });
}, 2000); 