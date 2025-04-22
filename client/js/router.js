// Router.js
import Overview from '../components/Overview.js';
import Transfer from '../components/Transfer.js';
import History from '../components/History.js';
import Login from '../components/Login.js';
import auth from '../services/auth.js';

export default class Router {
    constructor() {
        this.routes = {
            '/': Overview,
            '/overview': Overview,
            '/transfer': Transfer,
            '/history': History,
            '/login': Login
        };
        
        this.contentDiv = document.getElementById('pageContainer');
        this.currentComponent = null;
        
        // Adiciona listener para os botões do sidebar
        document.addEventListener('click', (e) => {
            const button = e.target.closest('.sidebar-button');
            if (button) {
                e.preventDefault();
                const page = button.dataset.page;
                // Mapeia "Visao Geral" para "/overview"
                const route = page === "Visao Geral" ? "/overview" : `/${page.toLowerCase()}`;
                this.navigateTo(route);
            }
        });

        // Adiciona listener para links internos
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="/"]');
            if (link) {
                e.preventDefault();
                this.navigateTo(link.getAttribute('href'));
            }
        });

        // Adiciona listener para mudanças na história do navegador
        window.addEventListener('popstate', () => this.handleRoute());
    }

    async handleRoute() {
        const path = window.location.pathname;
        
        // Se não estiver autenticado e não estiver na página de login, redireciona para login
        if (path !== '/login' && !await auth.checkAuth()) {
            this.navigateTo('/login');
            return;
        }

        // Se estiver autenticado e tentar acessar login, redireciona para overview
        if (path === '/login' && await auth.checkAuth()) {
            this.navigateTo('/overview');
            return;
        }

        const Component = this.routes[path] || this.routes['/'];
        
        // Cleanup previous component
        if (this.currentComponent && this.currentComponent.unmount) {
            this.currentComponent.unmount();
        }
        
        // Mount new component
        this.currentComponent = new Component();
        if (this.contentDiv) {
            this.currentComponent.mount();
            
            // Atualiza o botão ativo no sidebar
            this.updateActiveSidebarButton(path);
        }
    }

    updateActiveSidebarButton(path) {
        const buttons = document.querySelectorAll('.sidebar-button');
        buttons.forEach(button => {
            button.classList.remove('active');
            const buttonPage = button.dataset.page;
            if ((path === '/' || path === '/overview') && buttonPage === 'Visao Geral') {
                button.classList.add('active');
            } else if (path === '/transfer' && buttonPage === 'transfer') {
                button.classList.add('active');
            } else if (path === '/history' && buttonPage === 'statement') {
                button.classList.add('active');
            }
        });
    }

    navigateTo(route) {
        window.history.pushState(null, '', route);
        this.handleRoute();
    }

    init() {
        // Faz a primeira verificação de rota
        this.handleRoute();
    }
} 