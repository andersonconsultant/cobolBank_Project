// Login.js
import auth from '../services/auth.js';
import api from '../services/api.js';

export default class Login {
    constructor() {
        this.formData = {
            username: '',
            password: ''
        };
        
        // Verifica se já está autenticado
        this.checkAuth();
    }

    checkAuth() {
        if (auth.isAuthenticated()) {
            // Se já estiver autenticado, redireciona para overview
            this.navigateToOverview();
        }
    }

    mount() {
        const container = document.getElementById('pageContainer');
        if (!container) return;

        // Se já estiver autenticado, não mostra o login
        if (auth.isAuthenticated()) {
            this.navigateToOverview();
            return;
        }

        container.innerHTML = `
            <div class="login-container">
                <div class="login-box">
                    <h2>Login</h2>
                    <form id="loginForm">
                        <div class="form-group">
                            <label for="username">Usuário</label>
                            <input type="text" 
                                   id="username" 
                                   name="username" 
                                   class="form-control" 
                                   required
                                   autocomplete="username"
                                   aria-label="Nome de usuário">
                        </div>
                        <div class="form-group">
                            <label for="password">Senha</label>
                            <input type="password" 
                                   id="password" 
                                   name="password" 
                                   class="form-control" 
                                   required
                                   autocomplete="current-password"
                                   aria-label="Senha">
                        </div>
                        <div id="errorMessage" class="error-message text-danger" aria-live="assertive">
                            Usuário ou senha inválidos. Por favor, tente novamente.
                        </div>
                        <button type="submit" class="btn btn-primary btn-lg w-100">
                            Entrar
                        </button>
                    </form>
                </div>
            </div>
        `;

        this.addEventListeners();
    }

    addEventListeners() {
        const form = document.getElementById('loginForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleLogin();
            });
        }
    }

    async handleLogin() {
        const errorMessage = document.getElementById('errorMessage');
        const submitButton = document.querySelector('button[type="submit"]');
        
        try {
            // Desabilita o botão e remove mensagem de erro anterior
            submitButton.disabled = true;
            errorMessage.classList.remove('show');
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            const response = await api.login({ username, password });
            
            if (response.token) {
                // Salva os dados de autenticação
                auth.setAuth(response.token, response.user);
                
                // Dispara evento de login
                const loginEvent = new Event('login');
                document.dispatchEvent(loginEvent);
                
                // Mostra o sidebar após login
                const sidebar = document.getElementById('sidebar');
                if (sidebar) {
                    sidebar.classList.remove('d-none');
                }
                
                // Redireciona para a página inicial
                this.navigateToOverview();
            } else {
                throw new Error('Token não recebido');
            }
        } catch (error) {
            console.error('Erro no login:', error);
            // Mostra mensagem de erro
            errorMessage.classList.add('show');
            // Habilita o botão novamente
            submitButton.disabled = false;
        }
    }

    navigateToOverview() {
        // Atualiza a URL sem recarregar a página
        window.history.pushState({}, '', '/overview');
        
        // Dispara um evento de mudança de rota
        const routeEvent = new CustomEvent('routeChange', {
            detail: { route: '/overview' }
        });
        document.dispatchEvent(routeEvent);
    }

    unmount() {
        const form = document.getElementById('loginForm');
        if (form) {
            form.removeEventListener('submit', this.handleLogin);
        }
    }
} 