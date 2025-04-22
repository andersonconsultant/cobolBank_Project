import Router from './router.js';
import auth from '../services/auth.js';

class App {
    constructor() {
        this.router = new Router();
        this.sidebar = document.getElementById('sidebar');
    }

    async init() {
        // Verifica autenticação
        if (await auth.checkAuth()) {
            // Se autenticado, mostra o sidebar
            this.sidebar.classList.remove('d-none');
        }

        // Inicializa o router
        this.router.init();

        // Adiciona listener para eventos de autenticação
        document.addEventListener('login', () => {
            this.sidebar.classList.remove('d-none');
        });

        document.addEventListener('logout', () => {
            this.sidebar.classList.add('d-none');
        });
    }
}

// Inicializa a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
}); 