module.exports = {
    server: {
        port: process.env.LOG_SERVER_PORT || 4567,
        host: 'localhost'
    },
    cobol: {
        enginePath: './engine/Enginev4.cbl',
        maxRetries: 3,
        commandTimeout: 5000,
        maxQueueSize: 1000,
        batchSize: 100,
        retryDelay: 1000
    },
    database: {
        name: 'cobolbd',
        table: 'log_cobol_test'
    },
    validation: {
        maxLengths: {
            session_id: 10,
            component: 10,
            action: 20,
            status: 10,
            message: 100,
            endpoint: 50,
            method: 6,
            value: 12
        }
    },
    filters: {
        ignoreStaticRequests: true,
        ignoredPaths: [
            '/assets/',
            '/static/',
            '/images/',
            '/fonts/'
        ]
    }
}; 