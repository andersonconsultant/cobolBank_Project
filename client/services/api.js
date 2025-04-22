// api.js
class ApiService {
    constructor() {
        this.baseUrl = this.getBaseUrl();
        this.endpoints = {
            login: '/api/v1/cobol/login',
            transaction: '/api/v1/cobol/transaction',
            statement: '/api/v1/cobol/statement',
            health: '/api/v1/health'
        };
    }

    getBaseUrl() {
        // Usando a URL base do site sem /api pois já está incluído nos endpoints
        const host = window.location.hostname;
        const port = window.location.port;
        const protocol = window.location.protocol;
        return `${protocol}//${host}${port ? ':' + port : ''}`;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const token = localStorage.getItem('token');
        
        const defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };

        console.log('Fazendo requisição para:', url);
        console.log('Opções:', { ...options, headers: defaultHeaders });

        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    ...defaultHeaders,
                    ...options.headers
                }
            });

            const text = await response.text();
            console.log('Resposta da API (texto):', text);

            try {
                const data = text ? JSON.parse(text) : {};
                console.log('Resposta da API (JSON):', data);
                
                if (!response.ok) {
                    throw new Error(data.message || `HTTP error! status: ${response.status}`);
                }

                return data;
            } catch (e) {
                console.error('Erro ao fazer parse do JSON:', e);
                throw new Error(`Invalid JSON response: ${text}`);
            }
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Autenticação
    async login(credentials) {
        return this.request(this.endpoints.login, {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    }

    // Transações
    async createTransaction(transactionData) {
        return this.request(this.endpoints.transaction, {
            method: 'POST',
            body: JSON.stringify(transactionData)
        });
    }

    // Extrato
    async getStatement(params) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`${this.endpoints.statement}?${queryString}`);
    }

    // Health Check
    async checkHealth() {
        return this.request(this.endpoints.health);
    }
}

// Mock para desenvolvimento
class ApiServiceMock extends ApiService {
    constructor() {
        super();
        this.mockData = {
            login: {
                success: {
                    token: 'mock-token-123',
                    user: { 
                        id: 1, 
                        name: 'Test User',
                        balance: '1000.00'
                    }
                },
                error: {
                    message: 'Invalid credentials'
                }
            },
            transaction: {
                success: {
                    id: 'trans-123',
                    status: 'completed',
                    amount: 100.00
                }
            },
            statement: {
                transactions: [
                    {
                        id: 'trans-123',
                        date: '2024-03-25',
                        type: 'credit',
                        amount: 100.00,
                        description: 'Depósito'
                    }
                ]
            }
        };
    }

    async login(credentials) {
        await new Promise(resolve => setTimeout(resolve, 500));
        if (credentials.username === 'teste' && credentials.password === 'teste123') {
            return this.mockData.login.success;
        }
        throw new Error('Invalid credentials');
    }

    async createTransaction(data) {
        await new Promise(resolve => setTimeout(resolve, 800));
        return {
            ...this.mockData.transaction.success,
            amount: data.amount
        };
    }

    async getStatement() {
        await new Promise(resolve => setTimeout(resolve, 600));
        return this.mockData.statement;
    }

    async checkHealth() {
        return { status: 'healthy', environment: 'development' };
    }
}

// Usando o mock por padrão durante o desenvolvimento
const isDevelopment = true || window.location.hostname.includes('taile65a90.ts.net'); // Forçando modo desenvolvimento para testes e incluindo o domínio de produção

export default isDevelopment ? new ApiServiceMock() : new ApiService(); 