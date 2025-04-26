// auth.js
class AuthService {
    constructor() {
        this.token = localStorage.getItem('token');
        this.user = JSON.parse(localStorage.getItem('user') || 'null');
    }

    isAuthenticated() {
        return !!this.token;
    }

    getToken() {
        return this.token;
    }

    getUser() {
        return this.user;
    }

    setAuth(token, user) {
        this.token = token;
        this.user = user;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Dispara evento de login
        document.dispatchEvent(new CustomEvent('login'));
    }

    clearAuth() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Dispara evento de logout
        document.dispatchEvent(new CustomEvent('logout'));
    }

    // Middleware para verificar autenticação
    async checkAuth() {
        if (!this.isAuthenticated()) {
            return false;
        }

        try {
            // Aqui você pode adicionar uma chamada à API para validar o token
            // Por enquanto, apenas verifica se existe um token
            return true;
        } catch (error) {
            this.clearAuth();
            return false;
        }
    }
}

export default new AuthService(); 