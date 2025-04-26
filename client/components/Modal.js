// Modal.js
export default class Modal {
    constructor(options = {}) {
        this.id = options.id || 'modal-' + Math.random().toString(36).substr(2, 9);
        this.title = options.title || '';
        this.content = options.content || '';
        this.onClose = options.onClose || (() => {});
        this.isOpen = false;
        
        // Bind methods
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.handleEscapeKey = this.handleEscapeKey.bind(this);
        this.handleBackdropClick = this.handleBackdropClick.bind(this);
    }

    createModal() {
        const modal = document.createElement('div');
        modal.id = this.id;
        modal.className = 'modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', `${this.id}-title`);
        
        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-container">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 id="${this.id}-title" class="modal-title">${this.title}</h2>
                        <button type="button" class="btn-close" aria-label="Fechar">
                            <i class="fas fa-times" aria-hidden="true"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        ${this.content}
                    </div>
                </div>
            </div>
        `;

        return modal;
    }

    mount() {
        if (!document.getElementById(this.id)) {
            const modalElement = this.createModal();
            document.body.appendChild(modalElement);
            
            // Add event listeners
            const closeBtn = modalElement.querySelector('.btn-close');
            const backdrop = modalElement.querySelector('.modal-backdrop');
            
            closeBtn.addEventListener('click', this.close);
            backdrop.addEventListener('click', this.handleBackdropClick);
            document.addEventListener('keydown', this.handleEscapeKey);
        }
    }

    open() {
        const modal = document.getElementById(this.id);
        if (!modal) {
            this.mount();
        }

        const modalElement = document.getElementById(this.id);
        modalElement.classList.add('show');
        document.body.classList.add('modal-open');
        this.isOpen = true;

        // Foco no primeiro elemento focável
        setTimeout(() => {
            const firstFocusable = modalElement.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) {
                firstFocusable.focus();
            }
        }, 100);
    }

    close() {
        const modal = document.getElementById(this.id);
        if (modal) {
            modal.classList.remove('show');
            document.body.classList.remove('modal-open');
            this.isOpen = false;
            this.onClose();

            // Remover event listeners
            const closeBtn = modal.querySelector('.btn-close');
            const backdrop = modal.querySelector('.modal-backdrop');
            
            closeBtn.removeEventListener('click', this.close);
            backdrop.removeEventListener('click', this.handleBackdropClick);
            document.removeEventListener('keydown', this.handleEscapeKey);

            // Remover o modal do DOM após a animação
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
            }, 300);
        }
    }

    handleEscapeKey(event) {
        if (event.key === 'Escape' && this.isOpen) {
            this.close();
        }
    }

    handleBackdropClick(event) {
        if (event.target.classList.contains('modal-backdrop')) {
            this.close();
        }
    }

    setContent(content) {
        const modalBody = document.querySelector(`#${this.id} .modal-body`);
        if (modalBody) {
            modalBody.innerHTML = content;
        }
    }

    setTitle(title) {
        const modalTitle = document.querySelector(`#${this.id}-title`);
        if (modalTitle) {
            modalTitle.textContent = title;
            this.title = title;
        }
    }
} 