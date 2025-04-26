// History.js
export default class History {
    constructor() {
        this.mockTransactions = [];
        this.isLoading = true;
        this.filters = {
            period: '30',
            type: 'all',
            sort: 'date-desc'
        };

        // Bind dos métodos
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.formatCurrency = this.formatCurrency.bind(this);
        this.formatDate = this.formatDate.bind(this);
        this.handleTransactionClick = this.handleTransactionClick.bind(this);
    }

    async loadTransactions() {
        try {
            this.isLoading = true;
            this.renderLoadingState();

            // Simulação de delay de rede
            await new Promise(resolve => setTimeout(resolve, 800));

            console.log('Carregando transações...');
            const response = await fetch('./components/transactions.json');
            if (!response.ok) {
                console.error('Erro na resposta:', response.status, response.statusText);
                throw new Error(`Erro ao carregar transações: ${response.status}`);
            }

            const data = await response.json();
            console.log('Dados carregados:', data);
            
            if (!data.transactions || !Array.isArray(data.transactions)) {
                throw new Error('Formato de dados inválido');
            }

            this.mockTransactions = data.transactions.map(transaction => ({
                ...transaction,
                amount: parseFloat(transaction.amount),
                date: new Date(transaction.date)
            }));

            this.isLoading = false;
            this.render();
        } catch (error) {
            console.error('Erro ao carregar transações:', error);
            this.renderError(error);
        }
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    }

    formatDate(date) {
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(date);
    }

    getTransactionIcon(type) {
        const icons = {
            entrada: 'fa-arrow-down text-success',
            saida: 'fa-arrow-up text-danger',
            pix: 'fa-bolt text-primary',
            ted: 'fa-university text-primary',
            internal: 'fa-exchange-alt text-primary'
        };
        return icons[type] || 'fa-money-bill';
    }

    getLoadingTemplate() {
        return `
            <div class="history-container">
                <div class="card">
                    <div class="card-body">
                        <div class="loading-overlay active" role="status" aria-live="polite">
                            <div class="d-flex flex-column align-items-center justify-content-center h-100">
                                <div class="spinner-border text-primary mb-3"></div>
                                <p class="text-muted mb-0">Carregando histórico...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getErrorTemplate(error) {
        return `
            <div class="history-container">
                <div class="card">
                    <div class="card-body">
                        <div class="alert alert-danger mb-0" role="alert">
                            <div class="d-flex align-items-center">
                                <i class="fas fa-exclamation-circle me-2"></i>
                                <div>
                                    <h6 class="alert-heading mb-1">Erro ao carregar histórico</h6>
                                    <p class="mb-0">${error.message}</p>
                                </div>
                            </div>
                            <button class="btn btn-outline-danger mt-3" onclick="window.location.reload()">
                                <i class="fas fa-sync-alt me-2"></i>Tentar novamente
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getFilterTemplate() {
        return `
            <div class="row mb-4">
                <div class="col-md-4 mb-3">
                    <label class="form-label d-flex align-items-center">
                        <i class="fas fa-calendar me-2 text-primary"></i>
                        Período
                    </label>
                    <select class="form-select" id="periodFilter" aria-label="Filtrar por período">
                        <option value="7">Últimos 7 dias</option>
                        <option value="15">Últimos 15 dias</option>
                        <option value="30" selected>Últimos 30 dias</option>
                        <option value="90">Últimos 90 dias</option>
                        <option value="custom">Período personalizado</option>
                    </select>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label d-flex align-items-center">
                        <i class="fas fa-filter me-2 text-primary"></i>
                        Tipo
                    </label>
                    <select class="form-select" id="typeFilter" aria-label="Filtrar por tipo">
                        <option value="all" selected>Todos</option>
                        <option value="entrada">Entrada</option>
                        <option value="pix">PIX</option>
                        <option value="ted">TED</option>
                        <option value="internal">Entre Contas</option>
                    </select>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label d-flex align-items-center">
                        <i class="fas fa-sort me-2 text-primary"></i>
                        Ordenar por
                    </label>
                    <select class="form-select" id="sortFilter" aria-label="Ordenar transações">
                        <option value="date-desc" selected>Mais recentes</option>
                        <option value="date-asc">Mais antigos</option>
                        <option value="amount-desc">Maior valor</option>
                        <option value="amount-asc">Menor valor</option>
                    </select>
                </div>
            </div>
        `;
    }

    getTransactionTemplate(transaction) {
        const isNegative = transaction.amount < 0;
        return `
            <div class="transaction-item" 
                 role="button" 
                 tabindex="0"
                 data-transaction-id="${transaction.id}"
                 aria-label="Transação: ${transaction.description}, Valor: ${this.formatCurrency(transaction.amount)}, Data: ${this.formatDate(transaction.date)}">
                <div class="row align-items-center">
                    <div class="col-auto">
                        <div class="transaction-icon ${isNegative ? 'outgoing' : 'incoming'}">
                            <i class="fas ${this.getTransactionIcon(transaction.type)}" aria-hidden="true"></i>
                        </div>
                    </div>
                    <div class="col">
                        <div class="transaction-info">
                            <h6 class="transaction-description mb-0">${transaction.description}</h6>
                            <div class="transaction-details">
                                <span class="badge bg-light text-dark me-2">
                                    <i class="fas fa-clock me-1"></i>
                                    ${this.formatDate(transaction.date)}
                                </span>
                                <span class="badge bg-light text-dark">
                                    <i class="fas ${this.getTransactionIcon(transaction.type)} me-1"></i>
                                    ${transaction.type.toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="col-auto">
                        <span class="transaction-amount ${isNegative ? 'text-danger' : 'text-success'} fw-bold">
                            ${isNegative ? '-' : '+'}${this.formatCurrency(Math.abs(transaction.amount))}
                        </span>
                    </div>
                </div>
            </div>
        `;
    }

    getPaginationTemplate(currentPage = 1, totalPages = 1) {
        return `
            <nav class="mt-4" aria-label="Navegação de páginas">
                <ul class="pagination justify-content-center">
                    <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                        <button class="page-link" ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}">
                            <i class="fas fa-chevron-left me-1"></i>
                            Anterior
                        </button>
                    </li>
                    ${Array.from({ length: totalPages }, (_, i) => i + 1)
                        .map(page => `
                            <li class="page-item ${page === currentPage ? 'active' : ''}">
                                <button class="page-link" data-page="${page}">${page}</button>
                            </li>
                        `).join('')}
                    <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                        <button class="page-link" ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}">
                            Próxima
                            <i class="fas fa-chevron-right ms-1"></i>
                        </button>
                    </li>
                </ul>
            </nav>
        `;
    }

    render() {
        const container = document.getElementById('pageContainer');
        if (!container) return;

        if (this.isLoading) {
            this.renderLoadingState();
            return;
        }

        const filteredTransactions = this.getFilteredTransactions();

        container.innerHTML = `
            <div class="history-container">
                <div class="card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <h5 class="card-title mb-0">
                                <i class="fas fa-history me-2 text-primary"></i>
                                Histórico de Transações
                            </h5>
                            <div class="btn-group">
                                <button class="btn btn-outline-primary btn-sm" title="Exportar PDF">
                                    <i class="fas fa-file-pdf"></i>
                                </button>
                                <button class="btn btn-outline-primary btn-sm" title="Exportar Excel">
                                    <i class="fas fa-file-excel"></i>
                                </button>
                            </div>
                        </div>
                        
                        ${this.getFilterTemplate()}

                        <div class="transaction-list">
                            ${filteredTransactions.length > 0 
                                ? filteredTransactions.map(transaction => 
                                    this.getTransactionTemplate(transaction)).join('')
                                : this.getEmptyStateTemplate()}
                        </div>

                        ${this.getPaginationTemplate()}
                    </div>
                </div>
            </div>
        `;

        this.addEventListeners();
    }

    getEmptyStateTemplate() {
        return `
            <div class="text-center py-5">
                <div class="mb-3">
                    <i class="fas fa-search fa-3x text-muted"></i>
                </div>
                <h6 class="text-muted">Nenhuma transação encontrada</h6>
                <p class="text-muted mb-0">Tente ajustar os filtros de busca</p>
            </div>
        `;
    }

    renderLoadingState() {
        const container = document.getElementById('pageContainer');
        if (container) {
            container.innerHTML = this.getLoadingTemplate();
        }
    }

    renderError(error) {
        const container = document.getElementById('pageContainer');
        if (container) {
            container.innerHTML = this.getErrorTemplate(error);
        }
    }

    getFilteredTransactions() {
        let filtered = [...this.mockTransactions];

        // Filtro por período
        if (this.filters.period !== 'custom') {
            const days = parseInt(this.filters.period);
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - days);
            filtered = filtered.filter(t => t.date >= cutoffDate);
        }

        // Filtro por tipo
        if (this.filters.type !== 'all') {
            filtered = filtered.filter(t => t.type === this.filters.type);
        }

        // Ordenação
        filtered.sort((a, b) => {
            switch (this.filters.sort) {
                case 'date-asc':
                    return a.date - b.date;
                case 'date-desc':
                    return b.date - a.date;
                case 'amount-asc':
                    return a.amount - b.amount;
                case 'amount-desc':
                    return b.amount - a.amount;
                default:
                    return 0;
            }
        });

        return filtered;
    }

    handleFilterChange(event) {
        const { id, value } = event.target;
        const filterType = id.replace('Filter', '');
        this.filters[filterType] = value;
        this.render();
    }

    handleTransactionClick(event) {
        const transactionItem = event.target.closest('.transaction-item');
        if (!transactionItem) return;

        const transactionId = transactionItem.dataset.transactionId;
        const transaction = this.mockTransactions.find(t => t.id === transactionId);
        
        if (transaction) {
            // Aqui você pode implementar a lógica para mostrar detalhes da transação
            console.log('Detalhes da transação:', transaction);
        }
    }

    addEventListeners() {
        // Filtros
        ['period', 'type', 'sort'].forEach(filterType => {
            const filter = document.getElementById(`${filterType}Filter`);
            if (filter) {
                filter.value = this.filters[filterType];
                filter.addEventListener('change', this.handleFilterChange);
            }
        });

        // Clique nas transações
        const transactionItems = document.querySelectorAll('.transaction-item');
        transactionItems.forEach(item => {
            item.addEventListener('click', this.handleTransactionClick);
            item.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleTransactionClick(e);
                }
            });
        });
    }

    unmount() {
        // Remove event listeners
        ['period', 'type', 'sort'].forEach(filterType => {
            const filter = document.getElementById(`${filterType}Filter`);
            if (filter) {
                filter.removeEventListener('change', this.handleFilterChange);
            }
        });

        const transactionItems = document.querySelectorAll('.transaction-item');
        transactionItems.forEach(item => {
            item.removeEventListener('click', this.handleTransactionClick);
            item.removeEventListener('keypress', null);
        });
    }

    async mount() {
        await this.loadTransactions();
    }
} 