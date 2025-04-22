// Configurações globais
const config = {
    apiBaseUrl: '/api/v1',
    endpoints: {
        health: '/health',
        cobol: {
            bin: '/cobol/bin',
            login: '/cobol/login',
            transaction: '/cobol/transaction'
        }
    }
};

// Estado da aplicação
const state = {
    currentPage: 'home',
    isAuthenticated: false,
    userData: null
};

// Elementos da DOM
const elements = {
    pageContainer: document.getElementById('pageContainer'),
    sidebarButtons: document.querySelectorAll('.sidebar-button')
};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    initializeSidebar();
    checkApiHealth();
    loadPage('home');
});

// Funções da Sidebar
function initializeSidebar() {
    elements.sidebarButtons.forEach(button => {
        button.addEventListener('click', () => {
            const page = button.dataset.page;
            loadPage(page);
            updateActiveButton(button);
        });
    });
}

function updateActiveButton(activeButton) {
    elements.sidebarButtons.forEach(button => {
        button.classList.remove('active');
    });
    activeButton.classList.add('active');
}

// Funções de Carregamento de Página
async function loadPage(pageName) {
    state.currentPage = pageName;
    
    try {
        const pageContent = await fetchPageContent(pageName);
        elements.pageContainer.innerHTML = pageContent;
        initializePageScripts(pageName);
    } catch (error) {
        console.error(`Erro ao carregar a página ${pageName}:`, error);
        showError('Erro ao carregar a página. Por favor, tente novamente mais tarde.');
    }
}

async function fetchPageContent(pageName) {
    const pages = {
        home: `
            <div class="dashboard">
                <div class="card">
                    <h3>Saldo Disponível</h3>
                    <p class="balance">R$ 0,00</p>
                </div>
                <div class="card">
                    <h3>Últimas Transações</h3>
                    <div class="recent-transactions">
                        <!-- Transações serão carregadas aqui -->
                    </div>
                </div>
            </div>
        `,
        transfer: `
            <div class="transfer-form">
                <h2>Nova Transferência</h2>
                <form id="transferForm">
                    <div class="form-group">
                        <label for="account">Conta Destino</label>
                        <input type="text" id="account" required placeholder="Digite o número da conta">
                    </div>
                    <div class="form-group">
                        <label for="amount">Valor</label>
                        <input type="number" id="amount" required placeholder="R$ 0,00" step="0.01">
                    </div>
                    <button type="submit">Transferir</button>
                </form>
            </div>
        `,
        statement: `
            <div class="statement-container">
                <h2>Extrato</h2>
                <div class="statement-filters">
                    <select id="period">
                        <option value="today">Hoje</option>
                        <option value="week">Última Semana</option>
                        <option value="month">Último Mês</option>
                    </select>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Descrição</th>
                            <th>Valor</th>
                        </tr>
                    </thead>
                    <tbody id="statementBody">
                    </tbody>
                </table>
            </div>
        `,
        profile: `
            <div class="profile-container">
                <h2>Meu Perfil</h2>
                <div class="profile-info">
                    <p><strong>Nome:</strong> <span id="userName">-</span></p>
                    <p><strong>Conta:</strong> <span id="accountNumber">-</span></p>
                    <p><strong>Agência:</strong> <span id="agency">-</span></p>
                </div>
            </div>
        `
    };

    return pages[pageName] || pages.home;
}

function initializePageScripts(pageName) {
    switch (pageName) {
        case 'transfer':
            initializeTransferForm();
            break;
        case 'statement':
            loadStatement();
            break;
        case 'profile':
            loadProfileData();
            break;
    }
}

// Funções de API
async function checkApiHealth() {
    try {
        const response = await fetch(`${config.apiBaseUrl}${config.endpoints.health}`);
        if (!response.ok) {
            throw new Error('API não está respondendo');
        }
        console.log('API está funcionando corretamente');
    } catch (error) {
        console.error('Erro ao verificar saúde da API:', error);
        showError('Erro de conexão com o servidor');
    }
}

// Funções de Utilidade
function showError(message) {
    elements.pageContainer.innerHTML = `
        <div class="error-message">
            <h2>Erro</h2>
            <p>${message}</p>
        </div>
    `;
}

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date));
}

// Exportar funções necessárias
export {
    initializeSidebar,
    checkApiHealth,
    loadPage,
    formatCurrency,
    formatDate
};

import Login from '../components/Login.js';
import Dashboard from '../components/Dashboard.js';

class Router {
    constructor() {
        this.routes = {
            '/': Dashboard,
            '/login': Login,
            '/cobol/login': Login,
            '/dashboard': Dashboard,
            '#/': Dashboard,
            '#/login': Login,
            '#/dashboard': Dashboard
        };
        
        this.currentComponent = null;
        this.init();
    }

    init() {
        // Verificar se estamos usando path routing ou hash routing
        const path = window.location.pathname;
        const hash = window.location.hash;

        if (path.startsWith('/cobol')) {
            // Path routing
            this.handlePathRoute();
            window.addEventListener('popstate', () => this.handlePathRoute());
        } else {
            // Hash routing
            this.handleRoute();
            window.addEventListener('hashchange', () => this.handleRoute());
        }

        // Verificar autenticação inicial
        this.checkAuth();
    }

    handlePathRoute() {
        const path = window.location.pathname;
        console.log('Path routing:', path);
        
        // Se não houver rota definida, redirecionar para login
        if (!this.routes[path]) {
            this.navigateTo('/cobol/login');
            return;
        }

        this.unmountCurrentComponent();
        const Component = this.routes[path];
        this.currentComponent = new Component();
        this.currentComponent.mount();
    }

    handleRoute() {
        const hash = window.location.hash || '#/';
        console.log('Hash routing:', hash);
        
        // Se não houver rota definida, redirecionar para login
        if (!this.routes[hash]) {
            this.navigateTo('#/login');
            return;
        }

        this.unmountCurrentComponent();
        const Component = this.routes[hash];
        this.currentComponent = new Component();
        this.currentComponent.mount();
    }

    unmountCurrentComponent() {
        if (this.currentComponent && typeof this.currentComponent.unmount === 'function') {
            this.currentComponent.unmount();
        }
    }

    navigateTo(route) {
        if (route.startsWith('#')) {
            window.location.hash = route.substring(1);
        } else {
            window.history.pushState({}, '', route);
            this.handlePathRoute();
        }
    }

    checkAuth() {
        const token = localStorage.getItem('token');
        const currentPath = window.location.pathname;
        const currentHash = window.location.hash;

        // Rotas que não precisam de autenticação
        const publicRoutes = ['/login', '/cobol/login', '#/login'];

        if (!token) {
            // Se não estiver autenticado e tentar acessar uma rota protegida
            if (!publicRoutes.includes(currentPath) && !publicRoutes.includes(currentHash)) {
                if (currentPath.startsWith('/cobol')) {
                    this.navigateTo('/cobol/login');
                } else {
                    this.navigateTo('#/login');
                }
            }
        } else {
            // Se estiver autenticado e tentar acessar uma rota de login
            if (publicRoutes.includes(currentPath) || publicRoutes.includes(currentHash)) {
                if (currentPath.startsWith('/cobol')) {
                    this.navigateTo('/dashboard');
                } else {
                    this.navigateTo('#/dashboard');
                }
            }
        }
    }
}

// Inicializar o router quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.router = new Router();
});

// Exportar o router para uso global
export default Router; 