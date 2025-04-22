# CobolBank Project - Guia de Uso

## Controle de Versão

| Versão | Data       | Descrição das Alterações                   | Autor |
|--------|------------|-------------------------------------------|-------|
| 1.0.0  | 2024-03-25| Versão inicial - Frontend e Gateway        | -     |

## Visão Geral
Este repositório contém o front‑end estático (HTML, CSS, JS) e o gateway que encaminha as chamadas de API para o engine de regras COBOL, hospedado em `../cobolBank_Rules/api`.

## Estrutura do Projeto
```text
cobolBank_Project/
├── client/                # Front‑end: HTML, CSS, JavaScript
│   ├── index.html        # Página principal
│   ├── styles/           # Arquivos CSS
│   ├── fonts/            # Fontes customizadas
│   └── images/           # Imagens e ícones
├── package.json          # Dependências e scripts de desenvolvimento
├── node_modules/         # Módulos instalados
├── ecosystem.config.js   # Configuração PM2 para produção
└── GUIDE.md             # Este guia de uso
```

## Pré‑requisitos
- Node.js v14+ e npm v6+ instalados
- Serviço de regras COBOL rodando em `/srv/cobolBank_Rules/api`
- Acesso ao banco de dados PostgreSQL
- Permissões de execução para scripts COBOL

## Instalação
```bash
# 1. Clonar / atualizar front‑end
cd cobolBank_Project
npm install

# 2. Clonar / atualizar engine COBOL (caso ainda não tenha feito)
cd ../cobolBank_Rules/api
npm install
``` 

## Scripts Disponíveis
```bash
# Executa front‑end e engine COBOL em paralelo
npm run dev

# Inicia apenas o engine de regras COBOL
npm run dev:rules

# Serve apenas o front‑end estático
npm run dev:front

# Modo produção (ambos serviços)
npm start

# Deploy em produção via PM2
npm run pm2:start
```

### Detalhes dos Scripts
- **dev**: executa simultaneamente `dev:rules` e `dev:front` usando `concurrently`.
- **dev:rules**: sobe a API de regras COBOL em http://localhost:3000.
- **dev:front**: serve os arquivos de `client/` em http://localhost:8080 e proxy `/api` para o engine.
- **start**: mesmo que `dev`, ideal para staging/produção locais.
- **pm2:start**: inicia o front‑end com PM2 (use no servidor de produção).

## Integração com o Engine COBOL
Todas as requisições de API partem de `/api/v1` no front‑end e são encaminhadas para o serviço em `http://localhost:3000/api/v1`.

### Fluxo de Desenvolvimento
1. Em um terminal: `npm run dev:rules` (dentro de `cobolBank_Rules/api`).
2. Em outro: `npm run dev:front` (dentro de `cobolBank_Project`).
3. Abra http://localhost:8080 no navegador — o front‑end consome automaticamente o engine COBOL.

### Exemplos de Chamadas API

#### Inicialização do COBOL
```javascript
const API_BASE = '/api/v1';

async function startCobol() {
  const res = await fetch(`${API_BASE}/cobol/bin`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  console.log('Saída COBOL:', data.cobolOutput);
}
```

#### Autenticação
```javascript
async function login(userId, password) {
  const res = await fetch(`${API_BASE}/cobol/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data.token;
}
```

#### Transações
```javascript
async function processTransaction(transaction) {
  const res = await fetch(`${API_BASE}/cobol/transaction`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transaction)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data.receipt;
}
```

## Boas Práticas

### Frontend
1. **Organização de Código**
   - Use módulos ES6 para organização
   - Separe lógica de negócio da UI
   - Mantenha componentes reutilizáveis

2. **Estilo**
   - Siga o guia de estilo definido
   - Use variáveis CSS para cores e medidas
   - Mantenha consistência visual

3. **Performance**
   - Minimize requisições HTTP
   - Use lazy loading para imagens
   - Implemente cache quando apropriado

### Gateway
1. **Segurança**
   - Valide todas as entradas
   - Implemente rate limiting
   - Use HTTPS em produção

2. **Monitoramento**
   - Log todas as requisições
   - Implemente health checks
   - Monitore performance

## Testes

### Frontend
```javascript
// Exemplo de teste com Jest
describe('Login', () => {
  it('deve autenticar usuário válido', async () => {
    const response = await login('user123', 'pass123');
    expect(response.token).toBeDefined();
  });
});
```

### Gateway
```javascript
// Exemplo de teste de integração
describe('API Gateway', () => {
  it('deve encaminhar requisições para COBOL', async () => {
    const response = await fetch('/api/v1/cobol/bin');
    expect(response.status).toBe(200);
  });
});
```

## Suporte
- Front‑end/Gateway: frontend@cobolbank.com
- Engine COBOL: backend@cobolbank.com
- Emergências: oncall@cobolbank.com

## Checklist de Qualidade
- [ ] Testes unitários passando
- [ ] Testes de integração passando
- [ ] Documentação atualizada
- [ ] Código revisado
- [ ] Performance validada
- [ ] Segurança verificada