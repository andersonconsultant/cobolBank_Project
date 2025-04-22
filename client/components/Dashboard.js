export default class Dashboard {
    constructor() {
        this.container = document.getElementById('pageContainer');
        this.boundHandleLogout = this.handleLogout.bind(this);
        this.boundHandleTransfer = this.handleTransfer.bind(this);
        this.boundHandleStatement = this.handleStatement.bind(this);
        this.boundHandleVisaoGeral = this.handleVisaoGeral.bind(this);
    }

    mount() {
        if (!this.container) {
            console.error('Container não encontrado');
            return;
        }

        this.render();
        this.addEventListeners();
        this.showSidebar();
    }

    unmount() {
        this.removeEventListeners();
        this.hideSidebar();
        if (this.container) {
            this.container.innerHTML = '';
        }
    }

    showSidebar() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.remove('d-none');
        }
    }

    hideSidebar() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.add('d-none');
        }
    }

    render() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        this.container.innerHTML = `
            <div class="dashboard-container">
                <div class="welcome-section mb-4">
                    <h2>Bem-vindo ao CobolBank, ${userData.name || 'Usuário'}</h2>
                    <p>Último acesso: ${new Date().toLocaleString()}</p>
                </div>
                
                <div class="row g-4">
                    <!-- Saldo e Informações -->
                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">Saldo Atual</h5>
                                <p class="card-text balance">R$ ${userData.balance || '0,00'}</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Ações Rápidas -->
                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">Ações Rápidas</h5>
                                <div class="d-grid gap-2">
                                    <button id="visaoGeralBtn" class="btn btn-primary">
                                        <img src="assets/images/buttons/icon1Visao.png" alt="Visao Geral" class="iconButton">
                                        Visão Geral
                                    </button>
                                    <button id="transferBtn" class="btn btn-primary">
                                        <img src="assets/images/buttons/icon1Money.png" alt="Transferências" class="iconButton">
                                        Realizar Transferência
                                    </button>
                                    <button id="statementBtn" class="btn btn-primary">
                                        <img src="assets/images/buttons/icon1History.png" alt="Extrato" class="iconButton">
                                        Ver Extrato
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Últimas Transações -->
                <div class="row mt-4">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">Últimas Transações</h5>
                                <div class="table-responsive">
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th>Data</th>
                                                <th>Descrição</th>
                                                <th>Valor</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>25/03/2024</td>
                                                <td>Depósito</td>
                                                <td class="text-success">R$ 100,00</td>
                                                <td><span class="badge bg-success">Concluído</span></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-4 text-end">
                    <button id="logoutBtn" class="btn btn-outline-danger">
                        <i class="fas fa-sign-out-alt"></i> Sair
                    </button>
                </div>
            </div>
        `;
    }

    addEventListeners() {
        const logoutBtn = document.getElementById('logoutBtn');
        const transferBtn = document.getElementById('transferBtn');
        const statementBtn = document.getElementById('statementBtn');
        const visaoGeralBtn = document.getElementById('visaoGeralBtn');

        if (logoutBtn) logoutBtn.addEventListener('click', this.boundHandleLogout);
        if (transferBtn) transferBtn.addEventListener('click', this.boundHandleTransfer);
        if (statementBtn) statementBtn.addEventListener('click', this.boundHandleStatement);
        if (visaoGeralBtn) visaoGeralBtn.addEventListener('click', this.boundHandleVisaoGeral);

        // Adicionar listeners para botões da sidebar
        const sidebarButtons = document.querySelectorAll('.sidebar-button');
        sidebarButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const page = e.currentTarget.getAttribute('data-page');
                this.handlePageChange(page);
            });
        });
    }

    removeEventListeners() {
        const logoutBtn = document.getElementById('logoutBtn');
        const transferBtn = document.getElementById('transferBtn');
        const statementBtn = document.getElementById('statementBtn');
        const visaoGeralBtn = document.getElementById('visaoGeralBtn');

        if (logoutBtn) logoutBtn.removeEventListener('click', this.boundHandleLogout);
        if (transferBtn) transferBtn.removeEventListener('click', this.boundHandleTransfer);
        if (statementBtn) statementBtn.removeEventListener('click', this.boundHandleStatement);
        if (visaoGeralBtn) visaoGeralBtn.removeEventListener('click', this.boundHandleVisaoGeral);

        // Remover listeners da sidebar
        const sidebarButtons = document.querySelectorAll('.sidebar-button');
        sidebarButtons.forEach(button => {
            button.removeEventListener('click', this.handlePageChange);
        });
    }

    handleLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        this.hideSidebar();
        window.location.hash = '#/login';
    }

    handleTransfer() {
        window.location.hash = '#/transfer';
    }

    handleStatement() {
        window.location.hash = '#/statement';
    }

    handleVisaoGeral() {
        window.location.hash = '#/dashboard';
    }

    handlePageChange(page) {
        switch(page.toLowerCase()) {
            case 'visao geral':
                window.location.hash = '#/dashboard';
                break;
            case 'transfer':
                window.location.hash = '#/transfer';
                break;
            case 'statement':
                window.location.hash = '#/statement';
                break;
        }
    }
} 