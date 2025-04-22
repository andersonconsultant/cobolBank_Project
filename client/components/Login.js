// Login.js
import auth from '../services/auth.js';
import api from '../services/api.js';

export default class Login {
    constructor() {
        this.formData = {
            username: '',
            password: ''
        };
    }

    mount() {
        const container = document.getElementById('pageContainer');
        if (!container) return;

        container.innerHTML = `
            <div class="login-container">
                <div class="login-box">
                    <h2>Login</h2>
                    <form id="loginForm">
                        <div class="form-group">
                            <label for="username">Usuário</label>
                            <input type="text" id="username" name="username" required>
                        </div>
                        <div class="form-group">
                            <label for="password">Senha</label>
                            <input type="password" id="password" name="password" required>
                        </div>
                        <button type="submit" class="btn btn-primary w-100">Entrar</button>
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
        try {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            const response = await api.login({ username, password });
            
            if (response.token) {
                auth.setAuth(response.token, response.user);
                
                // Dispara evento de login
                const loginEvent = new Event('login');
                document.dispatchEvent(loginEvent);
                
                // Redireciona para a página inicial
                window.location.href = '/overview';
            } else {
                throw new Error('Token não recebido');
            }
        } catch (error) {
            console.error('Erro no login:', error);
            // Aqui você pode adicionar uma mensagem de erro na interface
            alert('Erro ao fazer login. Verifique suas credenciais.');
        }
    }

    unmount() {
        const form = document.getElementById('loginForm');
        if (form) {
            form.removeEventListener('submit', this.handleLogin);
        }
    }
} 