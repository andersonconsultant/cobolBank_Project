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
    }

    clearAuth() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    // Middleware para verificar autenticação
    async checkAuth() {
        if (!this.isAuthenticated()) {
            return false;
        }

        try {
            // Aqui você pode adicionar uma chamada para verificar se o token ainda é válido
            // Por exemplo, fazendo uma requisição para /api/v1/auth/verify
            return true;
        } catch (error) {
            this.clearAuth();
            return false;
        }
    }
}

export default new AuthService(); 