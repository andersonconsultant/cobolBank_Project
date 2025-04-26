import auth from '../services/auth.js';

export default class Sidebar {
    constructor() {
        // Bind dos métodos
        this.handleLogout = this.handleLogout.bind(this);
        this.addEventListeners = this.addEventListeners.bind(this);
        this.removeEventListeners = this.removeEventListeners.bind(this);
    }

    async handleLogout(event) {
        // Previne o comportamento padrão e propagação
        event.preventDefault();
        event.stopPropagation();
        
        try {
            // Adiciona feedback visual ao botão
            const logoutBtn = document.querySelector('.sidebar-logout');
            if (logoutBtn) {
                logoutBtn.disabled = true;
                logoutBtn.querySelector('.sidebar-item-text').textContent = 'Saindo...';
            }

            // Limpa a autenticação
            auth.clearAuth();
            
            // Oculta a sidebar
            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
                sidebar.classList.add('d-none');
            }
            
            // Dispara evento de logout
            document.dispatchEvent(new Event('logout'));
            
            // Navega para login
            window.history.pushState(null, '', '/login');
            window.dispatchEvent(new PopStateEvent('popstate'));
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            // Restaura o botão em caso de erro
            if (logoutBtn) {
                logoutBtn.disabled = false;
                logoutBtn.querySelector('.sidebar-item-text').textContent = 'Sair';
            }
        }
    }

    render() {
        const sidebarElement = document.createElement('aside');
        sidebarElement.id = 'sidebar';
        sidebarElement.className = 'sidebar d-none';
        
        sidebarElement.innerHTML = `
            <div class="sidebar-header">
                <div class="sidebar-logo">
                    <img src="./assets/images/logo/logov1.png" alt="CobolBank Logo">
                </div>
            </div>
            
            <nav class="sidebar-nav">
                <button class="sidebar-item active" data-page="overview">
                    <div class="sidebar-item-icon">
                        <i class="fas fa-home"></i>
                    </div>
                    <span class="sidebar-item-text">Início</span>
                </button>
                
                <button class="sidebar-item" data-page="history">
                    <div class="sidebar-item-icon">
                        <i class="fas fa-history"></i>
                    </div>
                    <span class="sidebar-item-text">Histórico</span>
                </button>
                
                <button class="sidebar-item" data-page="transfer">
                    <div class="sidebar-item-icon">
                        <i class="fas fa-exchange-alt"></i>
                    </div>
                    <span class="sidebar-item-text">Transferência</span>
                </button>
            </nav>
            
            <div class="sidebar-footer">
                <div class="user-profile">
                    <div class="user-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="user-info">
                        <div class="user-name">Usuário</div>
                        <div class="user-role">Cliente</div>
                    </div>
                </div>
                
                <button class="sidebar-item sidebar-logout mt-3" title="Fazer logout">
                    <div class="sidebar-item-icon">
                        <i class="fas fa-sign-out-alt"></i>
                    </div>
                    <span class="sidebar-item-text">Sair</span>
                </button>
            </div>
        `;

        document.body.appendChild(sidebarElement);
        this.addEventListeners();
    }

    addEventListeners() {
        // Adiciona listener para o botão de logout
        const logoutBtn = document.querySelector('.sidebar-logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', this.handleLogout);
        }

        // Adiciona listeners para os itens de navegação (excluindo explicitamente o botão de logout)
        const navItems = document.querySelectorAll('.sidebar-nav .sidebar-item');
        navItems.forEach(item => {
            item.addEventListener('click', (event) => {
                event.preventDefault();
                const page = item.dataset.page;
                if (page) {
                    const route = page === "overview" ? "/" : `/${page}`;
                    window.history.pushState(null, '', route);
                    const routeEvent = new CustomEvent('routeChange', {
                        detail: { route }
                    });
                    document.dispatchEvent(routeEvent);

                    // Atualiza o item ativo
                    navItems.forEach(i => i.classList.remove('active'));
                    item.classList.add('active');
                }
            });
        });
    }

    removeEventListeners() {
        const logoutBtn = document.querySelector('.sidebar-logout');
        if (logoutBtn) {
            logoutBtn.removeEventListener('click', this.handleLogout);
        }

        const navItems = document.querySelectorAll('.sidebar-item:not(.sidebar-logout)');
        navItems.forEach(item => {
            item.removeEventListener('click', null);
        });
    }

    mount() {
        this.render();
    }

    unmount() {
        this.removeEventListeners();
        const sidebar = document.getElementById('sidebar');
        if (sidebar && sidebar.parentNode) {
            sidebar.parentNode.removeChild(sidebar);
        }
    }
} 