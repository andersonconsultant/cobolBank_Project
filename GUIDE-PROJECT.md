# CobolBank Project - Guia de Uso

## Visão Geral
Este repositório contém o front‑end estático (HTML, CSS, JS) e o gateway que encaminha as chamadas de API para o engine de regras COBOL, hospedado em `../cobolBank_Rules/api`.

## Estrutura do Projeto
```text
cobolBank_Project/
├── client/                # Front‑end: HTML, CSS, JavaScript
├── package.json           # Dependências e scripts de desenvolvimento
├── node_modules/          # Módulos instalados
├── ecosystem.config.js    # Configuração PM2 para produção
└── GUIDE.md               # Este guia de uso
```

## Pré‑requisitos
- Node.js v14+ e npm v6+ instalados
- Serviço de regras COBOL rodando em `/srv/cobolBank_Rules/api`

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

# Inicia apenas o engine de regras COBOL	npm run dev:rules

# Serve apenas o front‑end estático    	npm run dev:front

# Modo produção (ambos serviços)      	npm start

# Deploy em produção via PM2           	npm run pm2:start
```

### Detalhes dos Scripts
- **dev**: executa simultaneamente `dev:rules` e `dev:front` usando `concurrently`.
- **dev:rules**: sobe a API de regras COBOL em http://localhost:3000.
- **dev:front**: serve os arquivos de `client/` em http://localhost:8080 e proxy `/api` para o engine.
- **start**: mesmo que `dev`, ideal para staging/produção locais.
- **pm2:start**: inicia o front‑end com PM2 (use no servidor de produção).

## Integração com o Engine COBOL
Todas as requisições de API partem de `/api/v1` no front‑end e são encaminhadas para o serviço em `http://localhost:3000/api/v1`.

**Fluxo de Desenvolvimento**
1. Em um terminal: `npm run dev:rules` (dentro de `cobolBank_Rules/api`).
2. Em outro: `npm run dev:front` (dentro de `cobolBank_Project`).
3. Abra http://localhost:8080 no navegador — o front‑end consome automaticamente o engine COBOL.

## Exemplo de Chamada (script.js)
```javascript
const API_BASE = '/api/v1';

async function startCobol() {
  const res = await fetch(`${API_BASE}/cobol/bin`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  console.log('Saída COBOL:', data.cobolOutput);
}

document.getElementById('buttonStartCobol')
  .addEventListener('click', startCobol);
```

## Suporte
- Front‑end/Gateway: frontend@cobolbank.com
- Engine COBOL: backend@cobolbank.com
- Emergências: oncall@cobolbank.com