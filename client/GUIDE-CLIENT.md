# GUIDE-CLIENT: Guia de Implementação Frontend

## Versão e Controle
- **Versão**: 1.0.0
- **Última Atualização**: 2024
- **Status**: Em desenvolvimento
- **Responsável**: Equipe de Frontend

## Propósito do Documento
Este guia fornece a documentação completa do frontend do CobolBank, incluindo estrutura do projeto, padrões de desenvolvimento, componentes e boas práticas implementadas.

## 1. Visão Geral da Arquitetura

### 1.1 Estrutura do Projeto
```
client/
├── components/         # Componentes modulares
│   ├── Overview.js    # Visão geral da conta
│   ├── Transfer.js    # Transferências
│   ├── History.js     # Histórico
│   └── Login.js       # Autenticação
├── js/                # Core da aplicação
│   ├── main.js        # Inicialização
│   ├── router.js      # Gerenciamento de rotas
│   └── auth.js        # Serviço de autenticação
├── services/          # Serviços e integrações
├── assets/            # Recursos estáticos
└── index.html         # Entrada da aplicação
```

## 2. Componentes e Funcionalidades

### 2.1 Sistema de Autenticação
- Login baseado em token JWT
- Persistência em localStorage
- Proteção automática de rotas
- Gerenciamento de sessão

### 2.2 Navegação e Routing
- Sistema SPA (Single Page Application)
- Rotas principais:
  ```
  /login      -> Autenticação
  /overview   -> Visão Geral
  /transfer   -> Transferências
  /history    -> Histórico
  ```
- Navegação sem refresh
- Proteção de rotas autenticadas

### 2.3 Componentes Principais

#### Overview
- Dashboard principal
- Exibição de saldo
- Resumo de transações
- Notificações do sistema

#### Transfer
- Múltiplos tipos de transferência
- Validação em tempo real
- Confirmação em duas etapas
- Feedback de sucesso/erro

#### History
- Filtros avançados
- Paginação
- Ordenação flexível
- Exportação de dados

## 3. Integração com Backend

### 3.1 Comunicação com API
- Requisições assíncronas (async/await)
- Interceptação de erros
- Renovação automática de token
- Cache de dados quando apropriado

### 3.2 Formato de Dados
```javascript
// Exemplo de transferência
{
  type: "PIX" | "TED" | "INTERNAL",
  amount: number,
  recipient: {
    key?: string,     // Para PIX
    bank?: string,    // Para TED
    account?: string  // Para TED/INTERNAL
  }
}
```

## 4. Boas Práticas

### 4.1 Desenvolvimento
- Componentes modulares
- Separação de responsabilidades
- Documentação inline
- Tratamento de erros consistente

### 4.2 Performance
- Lazy loading de componentes
- Otimização de imagens
- Minificação de assets
- Cache estratégico

### 4.3 Segurança
- Sanitização de inputs
- Proteção contra XSS
- Validação client-side
- Tokens seguros

## 5. Estilização e UI

### 5.1 Framework CSS
- Bootstrap 5
- Classes utilitárias
- Componentes personalizados
- Sistema de grid responsivo

### 5.2 Responsividade
- Mobile-first
- Breakpoints:
  ```css
  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px
  ```

### 5.3 Temas e Variáveis
```css
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --danger-color: #dc3545;
}
```

## 6. Testes e Qualidade

### 6.1 Testes Unitários
- Componentes isolados
- Funções utilitárias
- Mocks de serviços

### 6.2 Testes de Integração
- Fluxos completos
- Comunicação com API
- Navegação entre rotas

### 6.3 Validação
- HTML válido
- CSS consistente
- JavaScript lint
- Acessibilidade

## 7. Deploy e Ambiente

### 7.1 Builds
- Processo de build
- Otimização de assets
- Versionamento

### 7.2 Ambientes
- Desenvolvimento
- Homologação
- Produção

## 8. Troubleshooting

### 8.1 Problemas Comuns
- Erro de autenticação
- Falha na comunicação com API
- Problemas de cache

### 8.2 Soluções
- Limpar localStorage
- Verificar console
- Validar requisições
- Checar compatibilidade

## 9. Estratégia de Integração com Regras de Negócio

### 9.1 Preparação do Frontend
1. **Estrutura de Serviços**
   ```javascript
   // services/api.js
   class ApiService {
     // URLs base por ambiente
     static BASE_URLS = {
       development: 'http://localhost:3000/api/v1',
       homolog: 'http://homolog.cobolbank.com/api/v1',
       production: 'http://api.cobolbank.com/v1'
     };

     // Endpoints previstos
     static ENDPOINTS = {
       login: '/cobol/login',
       transaction: '/cobol/transaction',
       statement: '/cobol/statement',
       health: '/health'
     };
   }
   ```

2. **Camada de Mock**
   ```javascript
   // services/mockData.js
   const MockData = {
     login: {
       success: {
         token: 'mock-token-123',
         user: { id: 1, name: 'Test User' }
       },
       error: {
         message: 'Invalid credentials'
       }
     },
     transaction: {
       // dados de exemplo baseados nas regras de negócio
     }
   };
   ```

### 9.2 Interfaces de Dados
```typescript
// types/api.ts
interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    // outros campos conforme regras
  };
}

interface TransactionRequest {
  // campos baseados nas regras de negócio
}
```

### 9.3 Estados da Aplicação
1. **Loading States**
   ```javascript
   const loadingStates = {
     isLoading: false,
     isProcessing: false,
     error: null
   };
   ```

2. **Feedback Visual**
   ```javascript
   const feedbackMessages = {
     LOGIN_SUCCESS: 'Login realizado com sucesso',
     TRANSACTION_PROCESSING: 'Processando transação...',
     // outros conforme regras
   };
   ```

### 9.4 Fluxo de Desenvolvimento

#### 9.4.1 Fase 1: Preparação
1. [ ] Criar estrutura de serviços
2. [ ] Implementar interfaces de dados
3. [ ] Configurar ambiente de mock
4. [ ] Desenvolver componentes base

#### 9.4.2 Fase 2: Desenvolvimento Paralelo
1. [ ] Implementar UI com dados mock
2. [ ] Criar validações client-side
3. [ ] Preparar tratamento de erros
4. [ ] Desenvolver feedback visual

#### 9.4.3 Fase 3: Integração
1. [ ] Substituir mocks por chamadas reais
2. [ ] Implementar tratamento de erros da API
3. [ ] Validar regras de negócio
4. [ ] Realizar testes integrados

### 9.5 Validações Client-side

#### 9.5.1 Login
```javascript
const validateLogin = (data: LoginRequest) => {
  const errors = {};
  
  // Regras conforme GUIDE-RULES.md
  if (!data.username) errors.username = 'Username é obrigatório';
  if (!data.password) errors.password = 'Senha é obrigatória';
  
  return errors;
};
```

#### 9.5.2 Transações
```javascript
const validateTransaction = (data: TransactionRequest) => {
  const errors = {};
  
  // Implementar regras do GUIDE-RULES.md
  
  return errors;
};
```

### 9.6 Monitoramento e Logs
1. **Eventos de Usuário**
   ```javascript
   const logUserAction = (action, data) => {
     console.log(`[${new Date().toISOString()}] ${action}`, data);
     // Implementar envio para sistema de logs
   };
   ```

2. **Erros e Exceções**
   ```javascript
   const handleApiError = (error) => {
     logUserAction('API_ERROR', error);
     // Tratamento específico por tipo de erro
   };
   ```

### 9.7 Checklist de Integração
- [ ] Validar todos endpoints necessários
- [ ] Confirmar formato dos dados
- [ ] Verificar tratamento de erros
- [ ] Testar timeouts e retry
- [ ] Validar feedback ao usuário
- [ ] Confirmar regras de negócio
- [ ] Documentar pontos de integração
