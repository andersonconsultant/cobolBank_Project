import Router from './router.js';
import auth from '../services/auth.js';
import Sidebar from '../components/Sidebar.js';

class App {
    constructor() {
        this.router = new Router();
        // Store router instance on body element for global access
        document.querySelector('body').__router = this.router;
        
        this.sidebarComponent = new Sidebar();
        this.mobileOverlay = document.getElementById('mobileOverlay');
        
        // Bind dos métodos
        this.init = this.init.bind(this);
        this.showSidebar = this.showSidebar.bind(this);
        this.hideSidebar = this.hideSidebar.bind(this);
        this.toggleMobileMenu = this.toggleMobileMenu.bind(this);
        this.handleResize = this.handleResize.bind(this);
        
        // Estado
        this.isMobileMenuOpen = false;
    }

    showSidebar() {
        this.sidebarComponent.mount();
    }

    hideSidebar() {
        this.sidebarComponent.unmount();
    }

    toggleMobileMenu() {
        this.isMobileMenuOpen = !this.isMobileMenuOpen;
        const sidebar = document.getElementById('sidebar');
        
        if (sidebar) {
            sidebar.classList.toggle('open', this.isMobileMenuOpen);
        }
        
        if (this.mobileOverlay) {
            this.mobileOverlay.classList.toggle('active', this.isMobileMenuOpen);
        }
    }

    handleResize() {
        if (window.innerWidth > 768 && this.isMobileMenuOpen) {
            this.toggleMobileMenu();
        }
    }

    async init() {
        // Verifica autenticação
        if (await auth.checkAuth()) {
            // Se autenticado, mostra o sidebar
            this.showSidebar();
        }

        // Inicializa o router
        this.router.init();

        // Adiciona listener para eventos de autenticação
        document.addEventListener('login', this.showSidebar);
        document.addEventListener('logout', this.hideSidebar);

        // Adiciona listeners para menu mobile
        if (this.mobileOverlay) {
            this.mobileOverlay.addEventListener('click', this.toggleMobileMenu);
        }

        // Adiciona botão de menu para mobile
        const menuButton = document.createElement('button');
        menuButton.className = 'mobile-menu-button d-md-none';
        menuButton.innerHTML = '<i class="fas fa-bars"></i>';
        menuButton.addEventListener('click', this.toggleMobileMenu);
        document.body.appendChild(menuButton);

        // Listener para redimensionamento da janela
        window.addEventListener('resize', this.handleResize);

        // Fecha menu mobile ao clicar em links do sidebar
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.addEventListener('click', (e) => {
                if (e.target.closest('.sidebar-item') && this.isMobileMenuOpen) {
                    this.toggleMobileMenu();
                }
            });
        }
    }
}

// Inicializa a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
}); 