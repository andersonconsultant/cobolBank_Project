const COLORS = {
    REQUEST: '\x1b[36m',     // Cyan
    RESPONSE: '\x1b[32m',    // Green
    ERROR: '\x1b[31m',       // Red
    WARN: '\x1b[33m',        // Yellow
    INFO: '\x1b[34m',        // Blue
    COBOL: '\x1b[35m',       // Magenta
    RESET: '\x1b[0m'
};

const ICONS = {
    REQUEST: '→',
    RESPONSE: '←',
    ERROR: '✖',
    WARN: '⚠',
    INFO: 'ℹ',
    COBOL: '⚙'
};

function formatTime() {
    return new Date().toLocaleTimeString('pt-BR');
}

function formatData(data) {
    if (typeof data === 'object') {
        return JSON.stringify(data, null, 2);
    }
    return data;
}

function logRequest(req) {
    const { method, url, body, query } = req;
    console.log(`${COLORS.REQUEST}${ICONS.REQUEST} [${formatTime()}] ${method} ${url}`);
    
    if (Object.keys(query).length > 0) {
        console.log(`  Query: ${formatData(query)}`);
    }
    
    if (body && Object.keys(body).length > 0) {
        console.log(`  Body: ${formatData(body)}`);
    }
    
    console.log(COLORS.RESET);
}

function logResponse(req, res, data) {
    const duration = Date.now() - req.startTime;
    console.log(`${COLORS.RESPONSE}${ICONS.RESPONSE} [${formatTime()}] ${res.statusCode} ${req.method} ${req.url} (${duration}ms)`);
    
    if (data) {
        console.log(`  Response: ${formatData(data)}`);
    }
    
    console.log(COLORS.RESET);
}

function logError(error, req = null) {
    console.error(`${COLORS.ERROR}${ICONS.ERROR} [${formatTime()}] ERROR:`);
    if (req) {
        console.error(`  ${req.method} ${req.url}`);
    }
    console.error(`  ${error.message}`);
    if (error.stack) {
        console.error(`  Stack: ${error.stack.split('\n')[1].trim()}`);
    }
    console.error(COLORS.RESET);
}

function logCobol(operation, data) {
    console.log(`${COLORS.COBOL}${ICONS.COBOL} [${formatTime()}] COBOL ${operation}`);
    if (data) {
        console.log(`  Data: ${formatData(data)}`);
    }
    console.log(COLORS.RESET);
}

function logInfo(message, data = null) {
    console.log(`${COLORS.INFO}${ICONS.INFO} [${formatTime()}] ${message}`);
    if (data) {
        console.log(`  ${formatData(data)}`);
    }
    console.log(COLORS.RESET);
}

function logWarn(message, data = null) {
    console.log(`${COLORS.WARN}${ICONS.WARN} [${formatTime()}] ${message}`);
    if (data) {
        console.log(`  ${formatData(data)}`);
    }
    console.log(COLORS.RESET);
}

module.exports = {
    logRequest,
    logResponse,
    logError,
    logCobol,
    logInfo,
    logWarn
}; 