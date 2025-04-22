// History.js
export default class History {
    constructor() {
        this.mockTransactions = [];
        this.loadTransactions();
    }

    async loadTransactions() {
        try {
            const response = await fetch('/components/transactions.json');
            const data = await response.json();
            this.mockTransactions = data.transactions;
            this.mount(); // Remonta o componente após carregar os dados
        } catch (error) {
            console.error('Erro ao carregar transações:', error);
        }
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('pt-BR');
    }

    getTransactionIcon(type) {
        switch (type) {
            case 'entrada':
                return 'fa-arrow-down';
            case 'pix':
                return 'fa-bolt';
            case 'ted':
                return 'fa-university';
            case 'internal':
                return 'fa-exchange-alt';
            default:
                return 'fa-money-bill';
        }
    }

    mount() {
        const container = document.getElementById('pageContainer');
        if (!container) return;

        container.innerHTML = `
            <div class="history-container">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title mb-4">Histórico de Transações</h5>
                        
                        <!-- Filtros -->
                        <div class="row mb-4">
                            <div class="col-md-4 mb-3">
                                <label class="form-label">Período</label>
                                <select class="form-select" id="periodFilter">
                                    <option value="7">Últimos 7 dias</option>
                                    <option value="15">Últimos 15 dias</option>
                                    <option value="30" selected>Últimos 30 dias</option>
                                    <option value="90">Últimos 90 dias</option>
                                    <option value="custom">Período personalizado</option>
                                </select>
                            </div>
                            <div class="col-md-4 mb-3">
                                <label class="form-label">Tipo</label>
                                <select class="form-select" id="typeFilter">
                                    <option value="all" selected>Todos</option>
                                    <option value="entrada">Entrada</option>
                                    <option value="pix">PIX</option>
                                    <option value="ted">TED</option>
                                    <option value="internal">Entre Contas</option>
                                </select>
                            </div>
                            <div class="col-md-4 mb-3">
                                <label class="form-label">Ordenar por</label>
                                <select class="form-select" id="sortFilter">
                                    <option value="date-desc" selected>Mais recentes</option>
                                    <option value="date-asc">Mais antigos</option>
                                    <option value="amount-desc">Maior valor</option>
                                    <option value="amount-asc">Menor valor</option>
                                </select>
                            </div>
                        </div>

                        <!-- Lista de Transações -->
                        <div class="transaction-list">
                            ${this.mockTransactions.map(transaction => `
                                <div class="transaction-item">
                                    <div class="row align-items-center">
                                        <div class="col-auto">
                                            <div class="transaction-icon ${transaction.amount < 0 ? 'outgoing' : 'incoming'}">
                                                <i class="fas ${this.getTransactionIcon(transaction.type)}"></i>
                                            </div>
                                        </div>
                                        <div class="col">
                                            <div class="transaction-info">
                                                <h6 class="mb-0">${transaction.description}</h6>
                                                <small class="text-muted">
                                                    ${this.formatDate(transaction.date)} • 
                                                    ${transaction.type.toUpperCase()}
                                                </small>
                                            </div>
                                        </div>
                                        <div class="col-auto">
                                            <span class="transaction-amount ${transaction.amount < 0 ? 'text-danger' : 'text-success'}">
                                                ${this.formatCurrency(transaction.amount)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>

                        <!-- Paginação -->
                        <nav class="mt-4">
                            <ul class="pagination justify-content-center">
                                <li class="page-item disabled">
                                    <a class="page-link" href="#" tabindex="-1">Anterior</a>
                                </li>
                                <li class="page-item active">
                                    <a class="page-link" href="#">1</a>
                                </li>
                                <li class="page-item">
                                    <a class="page-link" href="#">2</a>
                                </li>
                                <li class="page-item">
                                    <a class="page-link" href="#">3</a>
                                </li>
                                <li class="page-item">
                                    <a class="page-link" href="#">Próxima</a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        `;

        this.addEventListeners();
    }

    addEventListeners() {
        const periodFilter = document.getElementById('periodFilter');
        const typeFilter = document.getElementById('typeFilter');
        const sortFilter = document.getElementById('sortFilter');

        [periodFilter, typeFilter, sortFilter].forEach(filter => {
            if (filter) {
                filter.addEventListener('change', () => {
                    console.log('Filtro alterado:', {
                        period: periodFilter?.value,
                        type: typeFilter?.value,
                        sort: sortFilter?.value
                    });
                });
            }
        });
    }

    unmount() {
        const filters = ['periodFilter', 'typeFilter', 'sortFilter'];
        filters.forEach(filterId => {
            const filter = document.getElementById(filterId);
            if (filter) {
                filter.removeEventListener('change', this.handleFilterChange);
            }
        });
    }
} 