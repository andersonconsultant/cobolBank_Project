# CobolBank Arquitetura Multi‑Serviços

> **Nota:** ao inspecionar o diretório `/srv`, considere apenas a pasta `cb_Project/` e o arquivo `config.json`; ignore as demais para otimizar a leitura de código.
>Dentro de cada pasta tem um GUIDE que orienta como interpretar o objetivo daquele diretório.

# Visão Geral
Este repositório contém um serviço que contorna o sistema legado COBOL:

- **Front‑end & Gateway** (`cobolBank_Project/`): serve a interface estática e faz proxy das chamadas à API.
- **Engine de Regras COBOL** (`cobolBank_Project/Rules/api/`): envolve os programas COBOL legados e os expõe via HTTP, permitindo escalabilidade.

## Estrutura de Diretórios
```text
/ (raiz do repositório)
├─ cb_Project/             # Front‑end estático e gateway de API
│   ├─ Rules/              # Regras de negócio e documentação
│   │   ├─ GUIDE-RULES.md  # Guia de regras de negócio e cenários de teste
│   │   └─ api/            # Serviço Express com endpoints COBOL
│   │       └─ GUIDE-API.md # Guia de integração da API de regras
│   └─ GUIDE-PROJECT.md    # Guia de uso e instruções do front-end
└─ config.json             # Configurações centrais (paths, DB, API)
```

## Documentação Detalhada
- 📄 [Front‑end Guide](./GUIDE-PROJECT.md)
- 📄 [Business Rules Guide](./Rules/GUIDE-RULES.md)
- 📄 [Back‑end COBOL API Guide](./Rules/api/GUIDE-API.md)
- ⚙️  `config.json` — parâmetros globais do projeto

## Como Começar
1. **Instalar dependências**
   ```bash
   npm install
   cd Rules/api && npm install
   ```
2. **Executar ambos em paralelo**
   ```bash
   npm run dev
   ```
   - Front‑end disponível em http://localhost:8080
   - API de regras COBOL em http://localhost:3000/api/v1

## Homologação (Staging)

Para validar em homologação, execute:
```bash
cd cb_Project
npm run dev
```
Isso sobe:
- Front‑end em http://127.0.0.1:8080
- API de regras em http://127.0.0.1:3000
Para acessar via NGINX ajustado, abra:
- Front‑end/API unificados em http://localhost:34003/

Use o NGINX como proxy para unificar portas:
```nginx
server {
    listen 34003;
    server_name localhost;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Nota:** Agora o NGINX está configurado para `listen 34003`. Acesse `http://localhost:34003/` para o front-end e `http://localhost:34003/api/v1` para a API.

## Acesso via Tailscale
Se o seu dispositivo estiver conectado à rede Tailscale, utilize o IP atribuído pelo Tailscale ou o subdomínio configurado:

- **IP Tailscale**  
  Front‑end (porta 8080): http://100.102.6.80:8080  
  API de Regras (porta 3000): http://100.102.6.80:3000/api/v1/health

- **Subdomínio Tailscale**  
  Front‑end: https://linux.taile65a90.ts.net/  
  API de Regras: https://linux.taile65a90.ts.net/api/v1/health

Isso confirma que o NGINX e os serviços estão acessíveis também pela rede Tailscale.

## Diagnóstico e Solução do 502 Bad Gateway

### 1) Bind em 0.0.0.0
- **Front‑end**: no script `dev:front`, use:
  ```bash
  npx serve -s client -l 8080 --listen 0.0.0.0
  ```
- **Engine COBOL**: em `config.js`, assegure `HOST = '0.0.0.0'` ou chame:
  ```js
  app.listen(port, '0.0.0.0', () => { … });
  ```

### 2) NGINX: ordenação e listen
```nginx
server {
    listen 34003 default_server;
    listen [::]:34003 default_server;
    server_name _;

    # API (deve vir antes de / para não ser mascarada)
    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Front-end (tudo que não bater em /api)
    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 3) Reinicializar e testar
```bash
sudo nginx -t && sudo systemctl reload nginx
# Testar front
curl -I http://localhost:34003/
# Testar API
curl -I http://localhost:34003/api/v1/health
```

Isso garante que:
- O NGINX escuta na porta 34003 em todas interfaces (IPv4 e IPv6)
- Roteia `/api` para o back-end e o restante para o front-end
- O Node.js e o fore-end estão expostos em `0.0.0.0`, permitindo o proxy interno e acesso externo via Tailscale.

## Próximos Passos e Boas Práticas
- **Docker & Docker Compose** para orquestração local e produção.
- **Workspaces** (Yarn ou npm) para compartilhamento de dependências.
- **Swagger/OpenAPI** para versionamento e documentação de endpoints.
- **CI/CD** (GitHub Actions, GitLab CI) com lint, testes e deploy automáticos.
- **Monitoramento e Logs** centralizados (Winston/Pino e ELK/Datadog).

## Deploy em Produção

### NGINX (Reverse Proxy)
```nginx
server {
    listen 34003;
    server_name localhost;

    # Front-end estático
    root /srv/cb_Project/client;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API de regras COBOL
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### PM2 (Gerenciamento de Processos)
```bash
# Iniciar o engine COBOL
pm2 start Rules/api/index.js --name cobol-rules-api

# Iniciar o front-end/gateway
pm2 start ecosystem.config.js --name cobolbank-frontend

# Exibir status dos processos
pm2 ls

# Ver logs
pm2 logs cobol-rules-api
pm2 logs cobolbank-frontend
```

---
_Created by CobolBank dev team — mantenha este guia atualizado conforme evoluímos o projeto._ 