// Transfer.js
export default class Transfer {
    constructor() {
        this.mockBanks = [
            { code: '001', name: 'Banco do Brasil' },
            { code: '341', name: 'Itaú' },
            { code: '033', name: 'Santander' },
            { code: '104', name: 'Caixa Econômica' },
            { code: '237', name: 'Bradesco' }
        ];
    }

    mount() {
        const container = document.getElementById('pageContainer');
        if (!container) return;

        container.innerHTML = `
            <div class="transfer-container">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Nova Transferência</h5>
                        
                        <!-- Tipo de Transferência -->
                        <div class="mb-4">
                            <div class="btn-group w-100" role="group">
                                <button type="button" class="btn btn-outline-primary active" data-type="pix">
                                    <i class="fas fa-bolt"></i> PIX
                                </button>
                                <button type="button" class="btn btn-outline-primary" data-type="ted">
                                    <i class="fas fa-university"></i> TED
                                </button>
                                <button type="button" class="btn btn-outline-primary" data-type="internal">
                                    <i class="fas fa-exchange-alt"></i> Entre Contas
                                </button>
                            </div>
                        </div>

                        <!-- Formulário -->
                        <form id="transferForm" class="needs-validation" novalidate>
                            <!-- Campo PIX -->
                            <div class="mb-3" id="pixField">
                                <label class="form-label">Chave PIX</label>
                                <div class="input-group">
                                    <select class="form-select" style="max-width: 150px;">
                                        <option value="cpf">CPF</option>
                                        <option value="email">E-mail</option>
                                        <option value="phone">Celular</option>
                                        <option value="random">Chave Aleatória</option>
                                    </select>
                                    <input type="text" class="form-control" placeholder="Digite a chave PIX">
                                </div>
                            </div>

                            <!-- Campos TED (inicialmente ocultos) -->
                            <div class="mb-3 d-none" id="tedFields">
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Banco</label>
                                        <select class="form-select">
                                            ${this.mockBanks.map(bank => 
                                                `<option value="${bank.code}">${bank.name}</option>`
                                            ).join('')}
                                        </select>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Agência</label>
                                        <input type="text" class="form-control" placeholder="0000">
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Conta</label>
                                        <input type="text" class="form-control" placeholder="00000-0">
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Tipo de Conta</label>
                                        <select class="form-select">
                                            <option value="corrente">Conta Corrente</option>
                                            <option value="poupanca">Conta Poupança</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <!-- Dados do Destinatário -->
                            <div class="mb-3">
                                <label class="form-label">Nome do Destinatário</label>
                                <input type="text" class="form-control" required>
                            </div>

                            <!-- Valor e Descrição -->
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Valor</label>
                                    <div class="input-group">
                                        <span class="input-group-text">R$</span>
                                        <input type="text" class="form-control" required>
                                    </div>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Descrição (opcional)</label>
                                    <input type="text" class="form-control">
                                </div>
                            </div>

                            <!-- Botões -->
                            <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                                <button type="button" class="btn btn-outline-secondary me-md-2">Cancelar</button>
                                <button type="submit" class="btn btn-primary">Continuar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        this.addEventListeners();
    }

    addEventListeners() {
        const form = document.getElementById('transferForm');
        const typeButtons = document.querySelectorAll('[data-type]');
        const pixField = document.getElementById('pixField');
        const tedFields = document.getElementById('tedFields');

        // Alternar entre tipos de transferência
        typeButtons.forEach(button => {
            button.addEventListener('click', () => {
                typeButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const type = button.dataset.type;
                if (type === 'pix') {
                    pixField.classList.remove('d-none');
                    tedFields.classList.add('d-none');
                } else if (type === 'ted') {
                    pixField.classList.add('d-none');
                    tedFields.classList.remove('d-none');
                } else {
                    pixField.classList.add('d-none');
                    tedFields.classList.add('d-none');
                }
            });
        });

        // Validação do formulário
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                if (!form.checkValidity()) {
                    e.stopPropagation();
                    form.classList.add('was-validated');
                    return;
                }
                
                // Aqui iria a lógica de envio
                alert('Transferência em processamento...');
            });
        }
    }

    unmount() {
        const form = document.getElementById('transferForm');
        const typeButtons = document.querySelectorAll('[data-type]');
        
        if (form) {
            form.removeEventListener('submit', this.handleSubmit);
        }

        typeButtons.forEach(button => {
            button.removeEventListener('click', this.handleTypeChange);
        });
    }
} 