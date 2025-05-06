/**
 * Configuração centralizada do aplicativo
 */
module.exports = {
    // Configuração do projeto
    project: {
        environment: process.env.NODE_ENV || 'development',
        architecture: 'integrated'
    },

    // Portas dos serviços
    ports: {
        frontend: process.env.FRONTEND_PORT || 3000,
        backend: process.env.BACKEND_PORT || 3001,
        cobol: process.env.COBOL_PORT || 4000,
        logs: process.env.LOG_SERVER_PORT || 4001
    },

    // Diretórios da aplicação
    directories: {
        rules: {
            cobol: 'Rules/api/cobol'
        }
    },

    // Caminhos dos arquivos e recursos
    paths: {
        client: {
            root: 'client',
            styles: 'client/styles',
            images: 'client/images',
            fonts: 'client/fonts',
            html: {
                index: 'client/index.html'
            }
        },
        cobol: {
            root: 'Rules/api/cobol',
            programs: {
                start: 'Rules/api/cobol/start',
                login: 'Rules/api/cobol/login',
                transaction: 'Rules/api/cobol/transaction'
            }
        },
        logs: {
            app: '/log/api-out.log',
            error: '/log/api-error.log',
            cobol: '/log/cobol.log'
        },
        api: {
            root: 'Rules/api'
        }
    },

    // Endpoints da API
    endpoints: {
        base: '/api/v1',
        health: '/health',
        cobol: {
            base: '/cobol',
            bin: '/cobol/bin',
            login: '/cobol/login',
            transaction: '/cobol/transaction'
        },
        auth: {
            login: '/auth/login',
            logout: '/auth/logout',
            refresh: '/auth/refresh'
        }
    },

    // Configuração do servidor
    server: {
        port: process.env.SERVER_PORT || 3000,
        host: process.env.SERVER_HOST || '0.0.0.0',
        cors: {
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }
    },

    // Executáveis
    executables: {
        engine: 'Rules/api/cobol/DEV/bin/Enginev3',
        name: 'Enginev3'
    },

    // Configuração de logging
    logging: {
        ignoreFrontend: false,
        ignoreStaticRequests: true,
        components: {
            backend: true,
            frontend: true,
            cobol: true
        },
        level: process.env.LOG_LEVEL || 'info'
    },

    cobol: {
        maxRetries: 3,
        lazyLoad: true
    }
}; 