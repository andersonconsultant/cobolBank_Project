// Transfer.js
import Modal from './Modal.js';

export default class Transfer {
    constructor(options = {}) {
        this.mockBanks = [
            { code: '001', name: 'Banco do Brasil' },
            { code: '341', name: 'Itaú' },
            { code: '033', name: 'Santander' },
            { code: '104', name: 'Caixa Econômica' },
            { code: '237', name: 'Bradesco' }
        ];

        // Bind dos métodos
        this.handleTransferTypeChange = this.handleTransferTypeChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        
        // Estado inicial
        this.isLoading = true;
        this.currentType = options.type || 'pix';
        this.isModal = options.isModal || false;
        this.isContentReady = false;
        
        // Criar modal se necessário
        if (this.isModal) {
            this.modal = new Modal({
                id: 'transfer-modal',
                title: 'Nova Transferência',
                onClose: () => this.unmount()
            });
        }
    }

    getLoadingContent() {
        return `
            <div class="loading-overlay active d-flex flex-column align-items-center justify-content-center" 
                 role="progressbar"
                 aria-label="Iniciando transferência">
                <div class="spinner-border text-primary mb-3" role="status">
                    <span class="visually-hidden">Carregando...</span>
                </div>
                <p class="h6 text-center mb-0">
                    <i class="fas fa-shield-check text-success me-2"></i>
                    Preparando ambiente seguro...
                </p>
            </div>
        `;
    }

    getTransferContent() {
        return `
            <div class="transfer-container">
                <!-- Loading State -->
                <div class="loading-overlay ${this.isLoading ? 'active' : ''}" 
                     aria-hidden="${!this.isLoading}"
                     role="progressbar"
                     aria-label="Processando transferência">
                    <div class="spinner"></div>
                </div>

                <div class="transfer-form-container">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <div class="security-badge">
                            <i class="fas fa-shield-check" aria-hidden="true"></i>
                            <span class="visually-hidden">Transação Segura</span>
                        </div>
                    </div>
                    
                    <!-- Tipo de Transferência -->
                    <div class="transfer-type-container" role="group" aria-label="Tipo de transferência">
                        <button type="button" 
                                class="btn btn-type ${this.currentType === 'pix' ? 'active' : ''}" 
                                data-type="pix"
                                aria-pressed="${this.currentType === 'pix'}">
                            <div class="type-icon">
                                <i class="fas fa-bolt" aria-hidden="true"></i>
                            </div>
                            <span>PIX</span>
                        </button>
                        <button type="button" 
                                class="btn btn-type ${this.currentType === 'ted' ? 'active' : ''}" 
                                data-type="ted"
                                aria-pressed="${this.currentType === 'ted'}">
                            <div class="type-icon">
                                <i class="fas fa-university" aria-hidden="true"></i>
                            </div>
                            <span>TED</span>
                        </button>
                        <button type="button" 
                                class="btn btn-type ${this.currentType === 'internal' ? 'active' : ''}" 
                                data-type="internal"
                                aria-pressed="${this.currentType === 'internal'}">
                            <div class="type-icon">
                                <i class="fas fa-exchange-alt" aria-hidden="true"></i>
                            </div>
                            <span>Entre Contas</span>
                        </button>
                    </div>

                    <!-- Formulário -->
                    <form id="transferForm" class="needs-validation" novalidate>
                        <!-- Campo PIX -->
                        <div class="form-group" id="pixField">
                            <label class="form-label">Chave PIX</label>
                            <div class="input-group">
                                <select class="form-select" style="max-width: 150px;" aria-label="Tipo de chave PIX">
                                    <option value="cpf">CPF</option>
                                    <option value="email">E-mail</option>
                                    <option value="phone">Celular</option>
                                    <option value="random">Chave Aleatória</option>
                                </select>
                                <input type="text" 
                                       class="form-control" 
                                       placeholder="Digite a chave PIX"
                                       aria-label="Valor da chave PIX"
                                       required>
                                <div class="invalid-feedback">
                                    Por favor, insira uma chave PIX válida.
                                </div>
                            </div>
                        </div>

                        <!-- Campos TED -->
                        <div class="form-group d-none" id="tedFields">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label class="form-label">Banco</label>
                                        <select class="form-select" required aria-label="Selecione o banco">
                                            <option value="">Selecione um banco</option>
                                            ${this.mockBanks.map(bank => 
                                                `<option value="${bank.code}">${bank.name}</option>`
                                            ).join('')}
                                        </select>
                                        <div class="invalid-feedback">
                                            Por favor, selecione um banco.
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label class="form-label">Agência</label>
                                        <input type="text" 
                                               class="form-control" 
                                               placeholder="0000"
                                               pattern="[0-9]{4}"
                                               maxlength="4"
                                               required
                                               aria-label="Número da agência">
                                        <div class="invalid-feedback">
                                            Agência deve ter 4 dígitos.
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label class="form-label">Conta</label>
                                        <input type="text" 
                                               class="form-control" 
                                               placeholder="00000-0"
                                               pattern="[0-9]{5}-[0-9]{1}"
                                               required
                                               aria-label="Número da conta">
                                        <div class="invalid-feedback">
                                            Conta deve estar no formato 00000-0
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label class="form-label">Tipo de Conta</label>
                                        <select class="form-select" required aria-label="Tipo de conta">
                                            <option value="">Selecione o tipo</option>
                                            <option value="corrente">Conta Corrente</option>
                                            <option value="poupanca">Conta Poupança</option>
                                        </select>
                                        <div class="invalid-feedback">
                                            Por favor, selecione o tipo de conta.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Dados do Destinatário -->
                        <div class="form-group">
                            <label class="form-label">Nome do Destinatário</label>
                            <input type="text" 
                                   class="form-control" 
                                   required
                                   aria-label="Nome do destinatário">
                            <div class="invalid-feedback">
                                Por favor, insira o nome do destinatário.
                            </div>
                        </div>

                        <!-- Valor e Descrição -->
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label class="form-label">Valor</label>
                                    <div class="input-group">
                                        <span class="input-group-text">R$</span>
                                        <input type="text" 
                                               class="form-control" 
                                               required
                                               pattern="^[0-9]+(\.[0-9]{2})?$"
                                               aria-label="Valor da transferência">
                                        <div class="invalid-feedback">
                                            Por favor, insira um valor válido.
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label class="form-label">
                                        Descrição
                                        <span class="text-muted">(opcional)</span>
                                    </label>
                                    <input type="text" 
                                           class="form-control"
                                           aria-label="Descrição da transferência">
                                </div>
                            </div>
                        </div>

                        <!-- Botões -->
                        <div class="form-actions">
                            <button type="button" 
                                    class="btn btn-secondary"
                                    data-action="cancel">
                                Cancelar
                            </button>
                            <button type="submit" 
                                    class="btn btn-primary"
                                    ${this.isLoading ? 'disabled' : ''}>
                                ${this.isLoading ? '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>' : ''}
                                Transferir
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    async mount() {
        try {
            if (this.isModal && this.modal) {
                // Primeiro mostra o loading
                this.modal.setContent(this.getLoadingContent());
                this.modal.open();
                
                // Aguarda um pouco para garantir que tudo está pronto
                await new Promise(resolve => setTimeout(resolve, 800));
                
                // Atualiza com o conteúdo real
                this.isLoading = false;
                this.modal.setContent(this.getTransferContent());
                this.addEventListeners();
                this.updateRequiredFields(this.currentType);
                this.isContentReady = true;
            } else {
                const container = document.getElementById('pageContainer');
                if (!container) return;
                
                // Primeiro mostra o loading
                container.innerHTML = this.getLoadingContent();
                
                // Aguarda um pouco para garantir que tudo está pronto
                await new Promise(resolve => setTimeout(resolve, 800));
                
                // Atualiza com o conteúdo real
                this.isLoading = false;
                container.innerHTML = this.getTransferContent();
                this.addEventListeners();
                this.updateRequiredFields(this.currentType);
                this.isContentReady = true;
            }
        } catch (error) {
            console.error('Erro ao montar o componente:', error);
            this.handleError();
        }
    }

    handleError() {
        const errorContent = `
            <div class="alert alert-danger" role="alert">
                <i class="fas fa-exclamation-circle me-2"></i>
                Ocorreu um erro ao carregar o formulário. 
                <button class="btn btn-link p-0 ms-3" onclick="window.location.reload()">
                    Tentar novamente
                </button>
            </div>
        `;

        if (this.isModal && this.modal) {
            this.modal.setContent(errorContent);
        } else {
            const container = document.getElementById('pageContainer');
            if (container) {
                container.innerHTML = errorContent;
            }
        }
    }

    unmount() {
        if (this.isModal && this.modal) {
            // Remove event listeners se o conteúdo estiver pronto
            if (this.isContentReady) {
                this.removeEventListeners();
            }
            
            this.modal.close();
            this.modal = null;
            this.isContentReady = false;
        } else {
            if (this.isContentReady) {
                this.removeEventListeners();
            }
        }
    }

    handleCancel() {
        if (this.isModal && this.modal) {
            this.modal.close();
        } else {
            history.back();
        }
    }

    addEventListeners() {
        // Botões de tipo de transferência
        const typeButtons = document.querySelectorAll('.btn-type');
        typeButtons.forEach(button => {
            button.removeEventListener('click', this.handleTransferTypeChange); // Remove existing first
            button.addEventListener('click', this.handleTransferTypeChange);
        });

        // Formulário
        const form = document.getElementById('transferForm');
        if (form) {
            form.removeEventListener('submit', this.handleSubmit); // Remove existing first
            form.addEventListener('submit', this.handleSubmit);
        }

        // Botão cancelar
        const cancelButton = document.querySelector('[data-action="cancel"]');
        if (cancelButton) {
            cancelButton.removeEventListener('click', this.handleCancel); // Remove existing first
            cancelButton.addEventListener('click', this.handleCancel);
        }

        // Máscara para campos numéricos
        this.setupInputMasks();
    }

    removeEventListeners() {
        const typeButtons = document.querySelectorAll('.btn-type');
        typeButtons.forEach(button => {
            button.removeEventListener('click', this.handleTransferTypeChange);
        });

        const form = document.getElementById('transferForm');
        if (form) {
            form.removeEventListener('submit', this.handleSubmit);
        }

        const cancelButton = document.querySelector('[data-action="cancel"]');
        if (cancelButton) {
            cancelButton.removeEventListener('click', this.handleCancel);
        }

        // Remove input masks
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            input.removeEventListener('input', null);
        });
    }

    setupInputMasks() {
        const agenciaInput = document.querySelector('input[placeholder="0000"]');
        if (agenciaInput) {
            agenciaInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
            });
        }

        const contaInput = document.querySelector('input[placeholder="00000-0"]');
        if (contaInput) {
            contaInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 6) {
                    value = value.slice(0, 6);
                }
                if (value.length >= 5) {
                    value = value.slice(0, 5) + '-' + value.slice(5);
                }
                e.target.value = value;
            });
        }

        const valorInput = document.querySelector('input[aria-label="Valor da transferência"]');
        if (valorInput) {
            valorInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                value = (parseInt(value) / 100).toFixed(2);
                e.target.value = value;
            });
        }
    }

    handleTransferTypeChange(event) {
        const button = event.currentTarget;
        const type = button.dataset.type;
        
        // Atualiza botões
        document.querySelectorAll('.btn-type').forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
        });
        button.classList.add('active');
        button.setAttribute('aria-pressed', 'true');

        // Atualiza campos visíveis
        const pixField = document.getElementById('pixField');
        const tedFields = document.getElementById('tedFields');
        
        if (type === 'pix') {
            pixField.classList.remove('d-none');
            tedFields.classList.add('d-none');
            this.updateRequiredFields('pix');
        } else if (type === 'ted') {
            pixField.classList.add('d-none');
            tedFields.classList.remove('d-none');
            this.updateRequiredFields('ted');
        } else {
            pixField.classList.add('d-none');
            tedFields.classList.add('d-none');
            this.updateRequiredFields('internal');
        }

        this.currentType = type;
    }

    updateRequiredFields(type) {
        // Remove required de todos os campos primeiro
        const allFields = document.querySelectorAll('#transferForm input, #transferForm select');
        allFields.forEach(field => {
            field.required = false;
        });

        // Adiciona required nos campos necessários
        const requiredFields = {
            pix: ['#pixField input[type="text"]'],
            ted: ['#tedFields select', '#tedFields input'],
            internal: []
        };

        requiredFields[type].forEach(selector => {
            document.querySelectorAll(selector).forEach(field => {
                field.required = true;
            });
        });

        // Campos comuns sempre required
        const commonFields = [
            'input[aria-label="Nome do destinatário"]',
            'input[aria-label="Valor da transferência"]'
        ];
        
        commonFields.forEach(selector => {
            const field = document.querySelector(selector);
            if (field) field.required = true;
        });
    }

    validateForm() {
        const form = document.getElementById('transferForm');
        if (!form) return false;

        let isValid = form.checkValidity();
        form.classList.add('was-validated');

        // Validações específicas por tipo
        if (this.currentType === 'pix') {
            // Adicionar validações específicas do PIX
        } else if (this.currentType === 'ted') {
            // Validar formato da agência e conta
            const agencia = document.querySelector('input[placeholder="0000"]');
            const conta = document.querySelector('input[placeholder="00000-0"]');
            
            if (agencia && !/^\d{4}$/.test(agencia.value)) {
                agencia.setCustomValidity('Agência inválida');
                isValid = false;
            }
            
            if (conta && !/^\d{5}-\d{1}$/.test(conta.value)) {
                conta.setCustomValidity('Conta inválida');
                isValid = false;
            }
        }

        return isValid;
    }

    async handleSubmit(event) {
        event.preventDefault();
        
        if (!this.validateForm()) return;

        try {
            this.isLoading = true;
            this.updateLoadingState();

            // Simulação de processamento
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Aqui iria a lógica real de envio
            console.log('Transferência processada com sucesso');
            
            // Redirecionar para confirmação
            window.location.href = '/transfer/confirmation';
        } catch (error) {
            console.error('Erro ao processar transferência:', error);
            // Implementar feedback de erro
        } finally {
            this.isLoading = false;
            this.updateLoadingState();
        }
    }

    updateLoadingState() {
        const submitButton = document.querySelector('button[type="submit"]');
        const loadingOverlay = document.querySelector('.loading-overlay');
        const spinnerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>';
        
        if (submitButton) {
            submitButton.disabled = this.isLoading;
            if (this.isLoading) {
                submitButton.innerHTML = `${spinnerHTML}Processando...`;
            } else {
                submitButton.innerHTML = 'Transferir';
            }
        }
        
        if (loadingOverlay) {
            if (this.isLoading) {
                loadingOverlay.classList.add('active');
                loadingOverlay.setAttribute('aria-hidden', 'false');
            } else {
                loadingOverlay.classList.remove('active');
                loadingOverlay.setAttribute('aria-hidden', 'true');
            }
        }
    }
} 