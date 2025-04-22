// Overview.js
export default class Overview {
    constructor() {
        this.mockData = {
            balance: 'R$ 5.432,10',
            lastTransactions: [
                { date: '2024-03-25', type: 'entrada', description: 'Depósito', value: 'R$ 1.000,00' },
                { date: '2024-03-24', type: 'saida', description: 'Transferência', value: 'R$ 150,00' },
                { date: '2024-03-24', type: 'entrada', description: 'PIX Recebido', value: 'R$ 80,00' },
                { date: '2024-03-23', type: 'saida', description: 'Pagamento', value: 'R$ 200,00' },
                { date: '2024-03-22', type: 'entrada', description: 'TED Recebida', value: 'R$ 450,00' }
            ],
            messages: [
                { type: 'info', text: 'Bem-vindo ao novo Internet Banking!' },
                { type: 'warning', text: 'Mantenha seus dados sempre atualizados' },
                { type: 'info', text: 'Novo horário de funcionamento do PIX' }
            ]
        };
    }

    mount() {
        const container = document.getElementById('pageContainer');
        if (!container) return;

        container.innerHTML = `
            <div class="overview-container">
                <!-- Saldo -->
                <div class="card mb-4">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <h5 class="card-title mb-0">Saldo Disponível</h5>
                            <button class="btn btn-link" id="toggleBalance">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                        <p class="balance-value" id="balanceValue">${this.mockData.balance}</p>
                    </div>
                </div>

                <!-- Últimas Transações -->
                <div class="card mb-4">
                    <div class="card-body">
                        <h5 class="card-title">Últimas Transações</h5>
                        <div class="table-responsive">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Data</th>
                                        <th>Descrição</th>
                                        <th>Valor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${this.mockData.lastTransactions.map(transaction => `
                                        <tr>
                                            <td>${new Date(transaction.date).toLocaleDateString()}</td>
                                            <td>${transaction.description}</td>
                                            <td class="text-${transaction.type === 'entrada' ? 'success' : 'danger'}">
                                                ${transaction.type === 'entrada' ? '+' : '-'} ${transaction.value}
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Mensagens -->
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Mensagens Importantes</h5>
                        <div class="messages-container">
                            ${this.mockData.messages.map(message => `
                                <div class="alert alert-${message.type === 'warning' ? 'warning' : 'info'} mb-2">
                                    ${message.text}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.addEventListeners();
    }

    addEventListeners() {
        const toggleBalance = document.getElementById('toggleBalance');
        const balanceValue = document.getElementById('balanceValue');
        
        if (toggleBalance && balanceValue) {
            toggleBalance.addEventListener('click', () => {
                const icon = toggleBalance.querySelector('i');
                if (balanceValue.textContent === '••••••') {
                    balanceValue.textContent = this.mockData.balance;
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                } else {
                    balanceValue.textContent = '••••••';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                }
            });
        }
    }

    unmount() {
        const toggleBalance = document.getElementById('toggleBalance');
        if (toggleBalance) {
            toggleBalance.removeEventListener('click', this.handleToggleBalance);
        }
    }
} 