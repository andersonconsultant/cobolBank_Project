// Router.js
import Overview from '../components/Overview.js';
import Transfer from '../components/Transfer.js';
import History from '../components/History.js';
import Login from '../components/Login.js';
import NotFound from '../components/NotFound.js';
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
        
        this.protectedRoutes = ['/', '/overview', '/transfer', '/history'];
        this.contentDiv = document.getElementById('pageContainer');
        this.currentComponent = null;
        
        // Adiciona listener para os botões do sidebar
        document.addEventListener('click', (e) => {
            const sidebarItem = e.target.closest('.sidebar-item');
            if (sidebarItem) {
                e.preventDefault();
                const page = sidebarItem.dataset.page;
                const route = page === "overview" ? "/" : `/${page}`;
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

        // Adiciona listener para eventos de login/logout
        document.addEventListener('login', () => {
            this.navigateTo('/overview');
            this.toggleSidebar(true);
        });

        document.addEventListener('logout', () => {
            this.navigateTo('/login');
            this.toggleSidebar(false);
        });

        // Adiciona listener para eventos de mudança de rota
        document.addEventListener('routeChange', (event) => {
            if (event.detail && event.detail.route) {
                this.navigateTo(event.detail.route);
            }
        });
    }

    toggleSidebar(show) {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            if (show) {
                sidebar.classList.remove('d-none');
            } else {
                sidebar.classList.add('d-none');
            }
        }
    }

    async handleRoute() {
        const path = window.location.pathname;
        
        // Verifica se a rota atual é protegida
        const isProtectedRoute = this.protectedRoutes.includes(path);
        const isAuthenticated = await auth.checkAuth();

        // Se não estiver autenticado e tentar acessar rota protegida
        if (isProtectedRoute && !isAuthenticated) {
            this.navigateTo('/login');
            return;
        }

        // Se estiver autenticado e tentar acessar login
        if (path === '/login' && isAuthenticated) {
            this.navigateTo('/overview');
            return;
        }

        // Atualiza visibilidade do sidebar
        this.toggleSidebar(isAuthenticated);

        const Component = this.routes[path] || NotFound;
        
        // Cleanup previous component
        if (this.currentComponent && this.currentComponent.unmount) {
            this.currentComponent.unmount();
        }
        
        // Mount new component
        this.currentComponent = new Component();
        if (this.contentDiv) {
            await this.currentComponent.mount();
            
            // Atualiza o botão ativo no sidebar
            this.updateActiveSidebarButton(path);
        }
    }

    updateActiveSidebarButton(path) {
        const items = document.querySelectorAll('.sidebar-item');
        items.forEach(item => {
            item.classList.remove('active');
            const itemPage = item.dataset.page;
            if ((path === '/' || path === '/overview') && itemPage === 'overview') {
                item.classList.add('active');
            } else if (path === '/transfer' && itemPage === 'transfer') {
                item.classList.add('active');
            } else if (path === '/history' && itemPage === 'history') {
                item.classList.add('active');
            }
        });
    }

    navigateTo(route) {
        window.history.pushState(null, '', route);
        this.handleRoute();
    }

    init() {
        // Verifica autenticação inicial
        const isAuthenticated = auth.isAuthenticated();
        this.toggleSidebar(isAuthenticated);
        
        // Faz a primeira verificação de rota
        this.handleRoute();
    }
} 