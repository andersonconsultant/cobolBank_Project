const http = require('http');

const COLORS = {
    GREEN: '\x1b[32m',
    RED: '\x1b[31m',
    YELLOW: '\x1b[33m',
    BLUE: '\x1b[34m',
    RESET: '\x1b[0m'
};

function checkService(url) {
    return new Promise((resolve) => {
        http.get(url, (res) => {
            // Considera 404 como "vivo" pois significa que o servidor está respondendo
            const isAlive = res.statusCode === 404 || (res.statusCode >= 200 && res.statusCode < 400);
            resolve({
                status: res.statusCode,
                alive: isAlive,
                message: res.statusCode === 404 ? 'Servidor rodando (404 - rota não encontrada)' : 'Online'
            });
        }).on('error', () => {
            resolve({
                status: 'Connection Failed',
                alive: false,
                message: 'Servidor não está respondendo'
            });
        });
    });
}

async function checkStatus() {
    console.log('\n=== Status dos Serviços CobolBank ===\n');

    // Verifica o backend na porta 3001 (modo backend-only)
    const backendStatus = await checkService('http://localhost:3001/api');
    console.log('Backend (3001):');
    console.log('  Status:', backendStatus.alive 
        ? `${COLORS.GREEN}${backendStatus.message}${COLORS.RESET}` 
        : `${COLORS.RED}${backendStatus.message}${COLORS.RESET}`);
    console.log('  Endpoint:', 'http://localhost:3001/api');
    console.log('  Código:', backendStatus.status);

    // Verifica o modo integrado na porta 3000
    const integratedStatus = await checkService('http://localhost:3000');
    console.log('\nModo Integrado (3000):');
    console.log('  Status:', integratedStatus.alive 
        ? `${COLORS.GREEN}${integratedStatus.message}${COLORS.RESET}` 
        : `${COLORS.RED}${integratedStatus.message}${COLORS.RESET}`);
    console.log('  Frontend:', 'http://localhost:3000');
    console.log('  API:', 'http://localhost:3000/api');
    console.log('  Código:', integratedStatus.status);

    console.log('\nModo de Operação:');
    if (backendStatus.alive && !integratedStatus.alive) {
        console.log(`${COLORS.GREEN}Backend-Only Mode${COLORS.RESET} (Porta 3001)`);
    } else if (!backendStatus.alive && integratedStatus.alive) {
        console.log(`${COLORS.GREEN}Integrated Mode${COLORS.RESET} (Porta 3000)`);
    } else if (backendStatus.alive && integratedStatus.alive) {
        console.log(`${COLORS.YELLOW}Ambos os modos estão ativos${COLORS.RESET}`);
    } else {
        console.log(`${COLORS.RED}Nenhum serviço está ativo${COLORS.RESET}`);
    }
    
    console.log('\nDicas:');
    console.log('1. O código 404 significa que o servidor está rodando, mas a rota específica não existe');
    console.log('2. Para testar a API, use uma rota válida como /api/saldo ou /api/extrato');
    
    console.log('\nPara iniciar serviços:');
    console.log('- Modo Integrado:    npm run start:integrated');
    console.log('- Backend Only:      npm run start:backend');
    console.log('- Ambos os serviços: npm run start:all\n');
}

checkStatus(); 