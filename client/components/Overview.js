// Overview.js
import Transfer from './Transfer.js';
import Modal from './Modal.js';

export default class Overview {
    constructor() {
        this.balance = null;
        this.transactions = [];
        this.isLoading = true;
        this.error = null;
        this.mockData = {
            lastTransactions: [
                { date: '2024-03-25', type: 'entrada', description: 'Depósito', value: 1000.00 },
                { date: '2024-03-24', type: 'saida', description: 'Transferência', value: 150.00 },
                { date: '2024-03-24', type: 'entrada', description: 'PIX Recebido', value: 80.00 },
                { date: '2024-03-23', type: 'saida', description: 'Pagamento', value: 200.00 },
                { date: '2024-03-22', type: 'entrada', description: 'TED Recebida', value: 450.00 }
            ],
            messages: [
                { type: 'info', text: 'Bem-vindo ao novo Internet Banking!' },
                { type: 'warning', text: 'Mantenha seus dados sempre atualizados' },
                { type: 'info', text: 'Novo horário de funcionamento do PIX' }
            ]
        };
        
        // Bind dos métodos
        this.handleToggleBalance = this.handleToggleBalance.bind(this);
        this.handleQuickActionTouch = this.handleQuickActionTouch.bind(this);
        this.hideLoading = this.hideLoading.bind(this);
        this.formatCurrency = this.formatCurrency.bind(this);
        this.loadData = this.loadData.bind(this);
        
        // Estado inicial
        this.loadingTimeout = null;
        this.transferComponent = null;
        this.isBalanceHidden = false;
        
        // Configuração do formatador de moeda
        this.currencyFormatter = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });

        // API URL - Usando caminho relativo para ser tratado pelo proxy
        this.apiUrl = '/api';
        console.log('API URL configurada (via proxy):', this.apiUrl);
    }

    async mount() {
        try {
            await this.loadData();
            this.render();
            this.attachEventListeners();
        } catch (error) {
            console.error('Error mounting Overview:', error);
        }
    }

    async loadData() {
        try {
            // Limpa erro anterior e inicia loading
            this.error = null;
            this.isLoading = true;
            this.render(); // Força renderização do estado de loading
            
            const url = `${this.apiUrl}/v1/saldo`;
            console.log('Fazendo requisição para:', url);
            
            // Busca o saldo da API
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).catch(error => {
                console.error('Erro na requisição fetch:', error);
                throw new Error(`Erro na conexão com o servidor: ${error.message}`);
            });
            
            console.log('Headers da resposta:', {
                contentType: response.headers.get('content-type'),
                cors: response.headers.get('access-control-allow-origin'),
                rateLimit: {
                    remaining: response.headers.get('x-ratelimit-remaining'),
                    reset: response.headers.get('x-ratelimit-reset')
                }
            });

            // Verifica se é erro de rate limit
            if (response.status === 429) {
                const data = await response.json();
                const retryAfter = response.headers.get('retry-after') || data.retryAfter || '60';
                const seconds = parseInt(retryAfter, 10);
                const minutes = Math.ceil(seconds / 60);
                
                throw {
                    type: 'RATE_LIMIT',
                    message: data.details || 'Muitas requisições em um curto período',
                    retryAfter: seconds,
                    friendlyMessage: `Para sua segurança, limite de requisições atingido. Por favor, aguarde ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}.`
                };
            }
            
            if (!response.ok) {
                console.error('Erro na resposta:', {
                    status: response.status,
                    statusText: response.statusText,
                    headers: Object.fromEntries([...response.headers])
                });
                throw new Error(`Erro ao buscar saldo: ${response.status} ${response.statusText}`);
            }
            
            const textResponse = await response.text();
            console.log('Resposta bruta:', textResponse);
            
            let data;
            try {
                data = JSON.parse(textResponse);
            } catch (e) {
                console.error('Erro ao fazer parse do JSON:', e);
                throw new Error('Resposta inválida do servidor');
            }
            
            console.log('Dados parseados:', data);
            
            if (!data.success) {
                throw new Error(data.message || 'Erro ao obter saldo');
            }

            if (!data.saldo || typeof data.saldo.raw === 'undefined') {
                console.error('Resposta sem saldo:', data);
                throw new Error('Dados de saldo inválidos');
            }

            // Atualiza os dados do componente
            this.balance = data.saldo.raw;
            console.log('Saldo atualizado:', this.balance);
            
            // Trata o saldo anterior (remove R$ e converte para número)
            if (data.saldo.anterior) {
                this.previousBalance = parseFloat(
                    data.saldo.anterior.replace(/[R$\s.]/g, '').replace(',', '.')
                );
            }

            // Atualiza informações de variação
            this.variation = data.saldo.variacao ? {
                percentage: data.saldo.variacao.percentual,
                direction: data.saldo.variacao.direcao
            } : null;
            
            // Atualiza data da última atualização
            this.lastUpdate = data.saldo.ultimaAtualizacao ? new Date(data.saldo.ultimaAtualizacao) : new Date();

            console.log('Dados atualizados com sucesso:', {
                balance: this.balance,
                previousBalance: this.previousBalance,
                variation: this.variation,
                lastUpdate: this.lastUpdate
            });

            // Mantém as transações mockadas por enquanto
            this.transactions = [
                {
                    id: 1,
                    type: 'incoming',
                    description: 'Depósito',
                    amount: 1500.00,
                    date: '2024-03-15'
                },
                {
                    id: 2,
                    type: 'outgoing',
                    description: 'Pagamento',
                    amount: -450.25,
                    date: '2024-03-14'
                },
                {
                    id: 3,
                    type: 'incoming',
                    description: 'Transferência recebida',
                    amount: 2000.00,
                    date: '2024-03-13'
                }
            ];
        } catch (error) {
            console.error('Erro ao acessar backend:', error);
            
            // Tratamento específico para rate limit
            if (error.type === 'RATE_LIMIT') {
                this.error = error.friendlyMessage;
                // Agenda uma atualização automática após o período de espera
                setTimeout(() => {
                    this.loadData();
                }, error.retryAfter * 1000);
            } else {
                this.error = error.message || 'Erro ao conectar com o servidor';
            }
            
            this.balance = null;
        } finally {
            this.isLoading = false;
            this.render();
        }
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    getTransactionIcon(type) {
        return type === 'incoming' ? 'fa-arrow-down' : 'fa-arrow-up';
    }

    render() {
        const mainContent = document.querySelector('#pageContainer');
        if (!mainContent) return;

        // Garantir que o overview está disponível globalmente para o botão de retry
        window.overview = this;

        const template = `
            <div class="overview-container">
                <div class="overview-grid">
                    <!-- Card de Saldo -->
                    <div class="balance-card">
                        <div class="card-body">
                            <h5 class="card-title">Saldo Disponível</h5>
                            <div class="balance-container ${this.isLoading ? 'loading' : ''}">
                                ${this.isLoading ? `
                                    <div class="loading-animation">
                                        <div class="loading-pulse"></div>
                                        <div class="loading-details">
                                            <div class="loading-line"></div>
                                            <div class="loading-line"></div>
                                        </div>
                                    </div>
                                ` : this.error ? `
                                    <div class="error-state">
                                        <i class="fas fa-exclamation-circle"></i>
                                        <p>${this.error}</p>
                                        ${!this.error.includes('limite de requisições') ? `
                                            <button class="btn-retry" onclick="window.overview.loadData()">
                                                <i class="fas fa-sync-alt"></i> Tentar novamente
                                            </button>
                                        ` : ''}
                                    </div>
                                ` : `
                                    <h2 class="balance-value">
                                        ${this.balance === null ? '---' : this.formatCurrency(this.balance)}
                                    </h2>
                                    ${this.variation ? `
                                        <p class="balance-variation">
                                            <i class="fas fa-arrow-${this.variation.direction === 'up' ? 'up' : 'down'}"></i>
                                            <span>${this.variation.percentage}% este mês</span>
                                        </p>
                                    ` : ''}
                                    <div class="d-flex justify-content-between align-items-center mt-3">
                                        <button class="btn-icon" title="Atualizar saldo">
                                            <i class="fas fa-sync-alt"></i>
                                        </button>
                                        <small class="text-muted">
                                            ${this.lastUpdate ? `Última atualização: ${this.lastUpdate.toLocaleString('pt-BR')}` : ''}
                                        </small>
                                    </div>
                                `}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Ações Rápidas -->
                <div class="quick-actions-grid">
                    <button class="quick-action-btn" data-action="transfer">
                        <div class="quick-action-icon">
                            <i class="fas fa-exchange-alt"></i>
                        </div>
                        <span class="quick-action-label">Transferir</span>
                    </button>
                    <button class="quick-action-btn" data-action="pay">
                        <div class="quick-action-icon">
                            <i class="fas fa-qrcode"></i>
                        </div>
                        <span class="quick-action-label">Pagar</span>
                    </button>
                    <button class="quick-action-btn" data-action="recharge">
                        <div class="quick-action-icon">
                            <i class="fas fa-mobile-alt"></i>
                        </div>
                        <span class="quick-action-label">Recarga</span>
                    </button>
                    <button class="quick-action-btn" data-action="invest">
                        <div class="quick-action-icon">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <span class="quick-action-label">Investir</span>
                    </button>
                </div>

                <!-- Card de Transações -->
                <div class="transactions-card">
                    <div class="card-body">
                        <h5 class="card-title">Últimas Transações</h5>
                        <div class="transaction-list">
                            ${this.transactions.map(transaction => `
                                <div class="transaction-item">
                                    <div class="transaction-icon ${transaction.type}">
                                        <i class="fas ${this.getTransactionIcon(transaction.type)}"></i>
                                    </div>
                                    <div class="transaction-info">
                                        <h6 class="transaction-description">${transaction.description}</h6>
                                        <small class="text-muted">${transaction.date}</small>
                                    </div>
                                    <div class="transaction-amount ${transaction.amount >= 0 ? 'text-success' : 'text-danger'}">
                                        ${this.formatCurrency(transaction.amount)}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        mainContent.innerHTML = template;
        
        // Adiciona estilos de loading se necessário
        if (!document.querySelector('#loading-styles')) {
            const style = document.createElement('style');
            style.id = 'loading-styles';
            style.textContent = `
                .balance-container.loading {
                    min-height: 150px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .loading-animation {
                    width: 100%;
                    padding: 1rem;
                }

                .loading-pulse {
                    height: 3rem;
                    background: linear-gradient(90deg, 
                        var(--bs-gray-200) 25%, 
                        var(--bs-gray-300) 50%, 
                        var(--bs-gray-200) 75%
                    );
                    background-size: 200% 100%;
                    animation: pulse 1.5s infinite ease-in-out;
                    border-radius: 8px;
                    margin-bottom: 1rem;
                }

                .loading-details {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .loading-line {
                    height: 1rem;
                    background: linear-gradient(90deg, 
                        var(--bs-gray-200) 25%, 
                        var(--bs-gray-300) 50%, 
                        var(--bs-gray-200) 75%
                    );
                    background-size: 200% 100%;
                    animation: pulse 1.5s infinite ease-in-out;
                    border-radius: 4px;
                }

                .loading-line:last-child {
                    width: 60%;
                }

                @keyframes pulse {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }

                .error-state {
                    text-align: center;
                    padding: 1rem;
                    color: var(--bs-danger);
                }

                .error-state i {
                    font-size: 2rem;
                    margin-bottom: 0.5rem;
                }

                .btn-retry {
                    background: none;
                    border: 1px solid var(--bs-danger);
                    color: var(--bs-danger);
                    padding: 0.5rem 1rem;
                    border-radius: 4px;
                    margin-top: 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .btn-retry:hover {
                    background: var(--bs-danger);
                    color: white;
                }

                .btn-icon {
                    background: none;
                    border: none;
                    color: var(--bs-primary);
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 50%;
                    transition: all 0.3s ease;
                }

                .btn-icon:hover {
                    background: var(--bs-gray-200);
                }

                .balance-value {
                    font-size: 2.5rem;
                    font-weight: bold;
                    margin-bottom: 0.5rem;
                }

                .balance-variation {
                    font-size: 1rem;
                    color: var(--bs-success);
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
            `;
            document.head.appendChild(style);
        }
    }

    attachEventListeners() {
        // Atualizar saldo
        const refreshButton = document.querySelector('.btn-icon');
        if (refreshButton) {
            refreshButton.addEventListener('click', async () => {
                refreshButton.style.transform = 'rotate(360deg)';
                refreshButton.style.transition = 'transform 0.5s ease';
                await this.loadData();
                this.render();
                setTimeout(() => {
                    refreshButton.style.transform = '';
                }, 500);
            });
        }

        // Ações rápidas
        const quickActionButtons = document.querySelectorAll('.quick-action-btn');
        quickActionButtons.forEach(button => {
            button.addEventListener('click', async (event) => {
                const action = button.dataset.action;
                
                // Adiciona feedback visual
                button.classList.add('active');
                button.disabled = true;

                try {
                    switch (action) {
                        case 'transfer':
                        case 'pay':
                            // Define o tipo de transferência
                            const transferType = action === 'transfer' ? 'ted' : 'pix';
                            
                            // Cria e monta o modal de transferência
                            const transfer = new Transfer({
                                isModal: true,
                                type: transferType
                            });
                            
                            await transfer.mount();
                            break;

                        case 'recharge':
                            console.log('Implementar recarga');
                            break;

                        case 'invest':
                            console.log('Implementar investimento');
                            break;
                    }
                } catch (error) {
                    console.error('Erro ao processar ação:', error);
                } finally {
                    // Remove feedback visual após 300ms
                    setTimeout(() => {
                        button.classList.remove('active');
                        button.disabled = false;
                    }, 300);
                }
            });
        });

        // Itens de transação
        const transactionItems = document.querySelectorAll('.transaction-item');
        transactionItems.forEach(item => {
            item.addEventListener('click', () => {
                const description = item.querySelector('.transaction-description').textContent;
                console.log(`Detalhes da transação: ${description}`);
            });
        });
    }

    handleToggleBalance(event) {
        const icon = event.currentTarget.querySelector('i');
        const balanceValue = document.getElementById('balanceValue');
        const balanceVariation = document.getElementById('balanceVariation');
        
        this.isBalanceHidden = !this.isBalanceHidden;
        
        // Animação de fade
        balanceValue.style.opacity = '0';
        if (balanceVariation) balanceVariation.style.opacity = '0';
        
        setTimeout(() => {
            balanceValue.textContent = this.isBalanceHidden ? '••••••' : this.formatCurrency(this.mockData.balance);
            if (balanceVariation) {
                balanceVariation.style.display = this.isBalanceHidden ? 'none' : 'block';
            }
            
            balanceValue.style.opacity = '1';
            if (balanceVariation && !this.isBalanceHidden) {
                balanceVariation.style.opacity = '1';
            }
        }, 300);

        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
        
        event.currentTarget.setAttribute('aria-label', 
            this.isBalanceHidden ? 'Mostrar saldo' : 'Ocultar saldo'
        );
    }

    hideLoading() {
        const loadingOverlay = document.querySelector('.loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.classList.remove('active');
            loadingOverlay.setAttribute('aria-hidden', 'true');
            
            // Remover o elemento após a animação
            setTimeout(() => {
                if (loadingOverlay && loadingOverlay.parentNode) {
                    loadingOverlay.parentNode.removeChild(loadingOverlay);
                }
            }, 300);
        }
        this.isLoading = false;
    }

    simulateLoading() {
        // Limpa qualquer timeout existente
        if (this.loadingTimeout) {
            clearTimeout(this.loadingTimeout);
            this.loadingTimeout = null;
        }

        // Garante que o loading esteja visível
        const loadingOverlay = document.querySelector('.loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('active');
            loadingOverlay.setAttribute('aria-hidden', 'false');
        }

        // Define novo timeout
        this.loadingTimeout = setTimeout(this.hideLoading, 800);
    }

    async handleQuickActionTouch(event) {
        const btn = event.currentTarget;
        const action = btn.querySelector('.quick-action-label').textContent;
        
        // Adiciona feedback visual e desabilita o botão
        btn.classList.add('active');
        btn.disabled = true;
        
        // Cria efeito de ripple
        const ripple = btn.querySelector('.ripple-effect');
        if (ripple) {
            const rect = btn.getBoundingClientRect();
            const x = event.type === 'touchstart' ? 
                event.touches[0].clientX - rect.left : 
                event.clientX - rect.left;
            const y = event.type === 'touchstart' ? 
                event.touches[0].clientY - rect.top : 
                event.clientY - rect.top;
            
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            ripple.classList.add('active');
        }

        try {
            // Abre o modal de transferência com o tipo apropriado
            if (action === 'Transferir' || action === 'Pagar') {
                // Define o tipo de transferência
                let transferType = 'pix';
                if (action === 'Transferir') transferType = 'ted';
                if (action === 'Pagar') transferType = 'internal';

                // Cria uma nova instância do Transfer como modal
                const transfer = new Transfer({
                    isModal: true,
                    type: transferType
                });
                
                // Aguarda a montagem do modal
                await transfer.mount();
            } else if (action === 'Recarga') {
                // Implementar recarga
                console.log('Recarga');
            } else if (action === 'Investir') {
                // Implementar investimento
                console.log('Investir');
            }
        } catch (error) {
            console.error('Erro ao processar ação:', error);
        } finally {
            // Remove o feedback visual e reabilita o botão
            setTimeout(() => {
                btn.classList.remove('active');
                btn.disabled = false;
                if (ripple) {
                    ripple.classList.remove('active');
                }
            }, 300);
        }
    }

    unmount() {
        // Limpa o timeout de loading
        if (this.loadingTimeout) {
            clearTimeout(this.loadingTimeout);
            this.loadingTimeout = null;
        }

        // Remove o overlay de loading
        const loadingOverlay = document.querySelector('.loading-overlay');
        if (loadingOverlay && loadingOverlay.parentNode) {
            loadingOverlay.parentNode.removeChild(loadingOverlay);
        }

        // Remove event listeners
        const toggleBalance = document.getElementById('toggleBalance');
        if (toggleBalance) {
            toggleBalance.removeEventListener('click', this.handleToggleBalance);
        }

        // Remove eventos dos botões de ação rápida
        const quickActionBtns = document.querySelectorAll('.quick-action-btn');
        quickActionBtns.forEach(btn => {
            btn.removeEventListener('click', this.handleQuickActionTouch);
        });

        // Limpa o componente de transferência
        if (this.transferComponent) {
            this.transferComponent = null;
        }
    }
} 