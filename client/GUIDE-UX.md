# Guia de UX - CobolBank (Cenário: Usuário)

## 1. Estrutura de Navegação

### 1.1 Sidebar Principal
A sidebar será o ponto central de navegação, contendo três seções essenciais para o usuário:

#### A. Visão Geral (Home)
- **Objetivo**: Fornecer visão rápida das informações principais
- **Componentes**:
  1. **Saldo Atual**
     - Valor em destaque
     - Botão para ocultar saldo
     - Atualização em tempo real
  
  2. **Últimas Transações**
     - Lista das 5 transações mais recentes
     - Ícones indicativos do tipo (entrada/saída)
     - Quick actions (ver detalhes)
  
  3. **Mensagens Importantes**
     - Avisos do banco
     - Dicas de segurança
     - Manutenções programadas

#### B. Transferências
- **Objetivo**: Realizar operações financeiras
- **Operações**:
  1. **Transferência**
     - Entre contas
     - Para outros bancos
     - Agendamentos
  
  2. **PIX**
     - Transferência
     - Chaves
     - QR Code
  
  3. **Depósitos**
     - Via boleto
     - Programado

#### C. Histórico
- **Objetivo**: Consultar movimentações
- **Funcionalidades**:
  1. **Extrato**
     - Filtros por período
     - Por tipo de operação
     - Download em PDF
  
  2. **Comprovantes**
     - Últimas operações
     - Download individual
     - Compartilhamento

## 2. Princípios de UX

### 2.1 Simplicidade
- Interface limpa e direta
- Ações principais em destaque
- Navegação intuitiva

### 2.2 Feedback ao Usuário
- Confirmações claras
- Mensagens de erro amigáveis
- Status das operações

### 2.3 Segurança Visual
- Ícones de segurança
- Tempo de sessão visível
- Botão de saída rápida

## 3. Fluxos Principais

### 3.1 Login
1. Inserir credenciais
2. Validação em duas etapas (quando ativado)
3. Acesso ao dashboard

### 3.2 Transferência
1. Selecionar tipo
2. Inserir dados do destinatário
3. Confirmar valor
4. Validar operação
5. Visualizar/baixar comprovante

### 3.3 Consulta de Extrato
1. Selecionar período
2. Visualizar transações
3. Filtrar (opcional)
4. Baixar/compartilhar

## 4. Próximos Passos

1. **Fase 1: Estrutura Base**
   - Implementar sidebar
   - Tela de login
   - Dashboard inicial

2. **Fase 2: Operações Básicas**
   - Transferências simples
   - Consulta de saldo
   - Extrato básico

3. **Fase 3: Melhorias**
   - PIX
   - Comprovantes
   - Filtros avançados

4. **Fase 4: Recursos Adicionais**
   - Agendamentos
   - Favoritos
   - Notificações 