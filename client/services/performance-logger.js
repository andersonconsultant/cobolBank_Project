/**
 * Logger minimalista para métricas de performance do frontend
 */
class PerformanceLogger {
    constructor() {
        this.timers = new Map();
        this.metrics = [];
        this.maxMetrics = 100; // Keep only last 100 metrics
    }

    // Inicia a medição de tempo para uma operação
    startTimer(operationName) {
        this.timers.set(operationName, performance.now());
        console.debug(`[Performance] Started timer for ${operationName}`);
    }

    // Finaliza a medição e retorna o tempo decorrido
    endTimer(operationName) {
        const startTime = this.timers.get(operationName);
        if (!startTime) {
            console.warn(`[Performance] No timer found for ${operationName}`);
            return;
        }

        const duration = performance.now() - startTime;
        this.timers.delete(operationName);

        const metric = {
            operation: operationName,
            duration,
            timestamp: new Date().toISOString()
        };

        this.metrics.push(metric);
        if (this.metrics.length > this.maxMetrics) {
            this.metrics.shift(); // Remove oldest metric
        }

        console.debug(`[Performance] ${operationName} took ${duration.toFixed(2)}ms`);
        
        // Store metrics in localStorage
        this.persistMetrics();
    }

    // Registra erros críticos que afetam o usuário
    logError(operationName, error) {
        const metric = {
            operation: operationName,
            error: error.message,
            timestamp: new Date().toISOString()
        };

        this.metrics.push(metric);
        if (this.metrics.length > this.maxMetrics) {
            this.metrics.shift();
        }

        console.error(`[Performance] Error in ${operationName}:`, error);
        
        // Store metrics in localStorage
        this.persistMetrics();
    }

    persistMetrics() {
        try {
            localStorage.setItem('performance_metrics', JSON.stringify(this.metrics));
        } catch (error) {
            console.warn('[Performance] Failed to persist metrics:', error);
        }
    }

    getMetrics() {
        return this.metrics;
    }

    clearMetrics() {
        this.metrics = [];
        localStorage.removeItem('performance_metrics');
    }
}

// Create singleton instance
const performanceLogger = new PerformanceLogger();

// Load any persisted metrics on initialization
try {
    const savedMetrics = localStorage.getItem('performance_metrics');
    if (savedMetrics) {
        performanceLogger.metrics = JSON.parse(savedMetrics);
    }
} catch (error) {
    console.warn('[Performance] Failed to load persisted metrics:', error);
}

export default performanceLogger; 