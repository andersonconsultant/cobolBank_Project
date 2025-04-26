# 🔄 Estratégia de Processamento em Fila para COBOL

## 📋 Contexto

Durante o desenvolvimento do CobolBank, identificamos um desafio significativo: o processamento de grandes volumes de dados no COBOL pode resultar em problemas de buffer overflow. Para resolver esse problema, desenvolvemos uma estratégia que divide o processamento em partes menores e utiliza uma API para gerenciar a execução.

## 🎯 Problema Identificado e Solução Integrada

### Desafios Técnicos
```
1. Buffer Overflow:
   - Limitação de memória no processamento COBOL
   - Risco de perda de dados
   - Impacto na performance do sistema

2. Integração com Sistema Moderno:
   - Necessidade de manter experiência do usuário fluida
   - Garantir feedback em tempo real
   - Evitar bloqueios de interface
```

### Solução Proposta
```
1. Sistema de Filas:
   - Particionamento inteligente de dados
   - Processamento assíncrono
   - Controle de status em tempo real

2. Integração Frontend-COBOL:
   - API de gerenciamento de filas
   - Sistema de fallback para alta disponibilidade
   - Feedback em tempo real para o usuário
```

## 💡 Implementação Técnica

### Arquitetura da Solução
```
1. Camada de API (Orquestradora):
   - Gerenciamento do fluxo completo
   - Divisão dos dados em lotes de 100 caracteres
   - Controle da fila de processamento
   - Monitoramento e recuperação de falhas

2. Camada COBOL (Executora):
   - Processamento de queries específicas
   - Recebimento de dados via parâmetros
   - Execução de operações no banco
   - Retorno de resultados padronizados

3. Camada de Dados:
   - Tabelas de controle (event_transfer)
   - Armazenamento de resultados (event_transfer_end)
   - Gestão de estados e progresso
   - Garantia de integridade transacional
```

### Fluxo de Dados
```
1. Entrada de Dados:
   - API recebe dados para processamento
   - Validação inicial de formato e tamanho
   - Divisão em lotes de 100 caracteres
   - Criação de instância de processamento

2. Processamento:
   - API insere lotes na fila (event_transfer)
   - API monitora itens PENDING
   - COBOL é chamado para cada lote
   - Resultados são registrados (event_transfer_end)

3. Consolidação:
   - API verifica conclusão de todos os lotes
   - Agregação dos resultados na ordem correta
   - Validação final dos dados processados
   - Retorno do resultado consolidado
```

### Controle de Estado
```
1. Estados do Processamento:
   - PENDING: Lote aguardando processamento
   - PROCESSING: COBOL executando query
   - COMPLETED: Processamento bem-sucedido
   - ERROR: Falha na execução
   - CONSOLIDATED: Resultado final agregado

2. Pontos de Controle:
   - Verificação de integridade por lote
   - Monitoramento de tempo de execução
   - Detecção de falhas e recuperação
   - Garantia de ordem de processamento
```

## 📊 Métricas e Qualidade

### Indicadores de Sucesso
```
1. Performance:
   - Tempo de processamento por lote
   - Taxa de sucesso/erro
   - Uso de memória
   - Latência de resposta

2. Experiência do Usuário:
   - Tempo de resposta percebido
   - Feedback visual de progresso
   - Taxa de falhas reportadas
   - Satisfação do usuário
```

### Segurança e Conformidade
```
1. Controles:
   - Autenticação por operação
   - Validação de dados
   - Registro de auditoria
   - Proteção contra overflow

2. Recuperação:
   - Sistema de rollback
   - Retry automático
   - Backup de dados
   - Logs detalhados
```

## 🔄 Ciclo de Vida do Processamento

### Fluxo de Execução
```
1. Inicialização:
   - Validação de usuário
   - Cálculo de partições
   - Criação da fila

2. Processamento:
   - Execução por lotes
   - Monitoramento contínuo
   - Atualização de status

3. Finalização:
   - Validação final
   - Consolidação de resultados
   - Limpeza de recursos
```

## 📊 Controle de Eventos e Status

### Tabela de Eventos
```sql
CREATE TABLE event_transfer (
    id_event SERIAL PRIMARY KEY,
    id_fn_transfer INTEGER REFERENCES fn_transfer(id),
    status VARCHAR(20),
    total_partitions INTEGER,
    processed_partitions INTEGER DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);
```

### Status do Processamento
```
Estados possíveis do status:
1. PENDING     - Evento criado, aguardando início do processamento
2. PROCESSING  - Processamento das partições em andamento
3. COMPLETED   - Todas as partições processadas com sucesso
4. FAILED      - Erro durante o processamento
5. PARTIAL     - Algumas partições processadas com sucesso, outras com erro
```

### Fluxo de Atualização
```
1. Criação do Evento:
   - Insere registro com status PENDING
   - Define total_partitions com base no cálculo do BD

2. Durante Processamento:
   - API atualiza status para PROCESSING
   - Incrementa processed_partitions a cada partição concluída
   - Registra eventuais erros no error_message

3. Finalização:
   - Se todas partições OK -> status = COMPLETED
   - Se erro total -> status = FAILED
   - Se erro parcial -> status = PARTIAL
   - Preenche completed_at com timestamp da conclusão
```

### Exemplo de Uso na API
```javascript
// Atualização de status durante processamento
UPDATE event_transfer 
SET status = 'PROCESSING',
    processed_partitions = processed_partitions + 1,
    updated_at = CURRENT_TIMESTAMP
WHERE id_event = [EVENT_ID];

// Finalização do processamento
UPDATE event_transfer 
SET status = 'COMPLETED',
    completed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id_event = [EVENT_ID];
```

## 📊 Análise de Capacidade e Estratégias de Particionamento

### Testes de Limite COBOL
```
1. Testes por Volume de Dados:
   - Teste incremental: 1K, 5K, 10K, 50K registros
   - Monitorar: uso de memória, tempo de processamento, erros
   - Identificar ponto de saturação do COBOL

2. Testes por Tamanho de Caracteres:
   - Teste por registro: 100, 500, 1000, 5000 caracteres
   - Avaliar impacto de campos TEXT/VARCHAR longos
   - Identificar limite seguro de caracteres por processamento
```

### Estratégias de Particionamento

1. **Particionamento por Linhas**
   ```
   Vantagens:
   - Mais simples de implementar
   - Fácil de manter consistência
   - Melhor para dados uniformes

   Desvantagens:
   - Pode não ser eficiente com linhas muito grandes
   - Desbalanceamento se houver variação no tamanho das linhas
   ```

2. **Particionamento por Colunas**
   ```
   Vantagens:
   - Melhor para tabelas com muitas colunas
   - Permite processamento específico por tipo de dado
   - Reduz carga de memória por operação

   Desvantagens:
   - Complexidade na junção dos resultados
   - Necessidade de sincronização entre partições
   ```

3. **Particionamento Híbrido**
   ```
   Estratégia:
   - Dividir primeiro por grupos de colunas relacionadas
   - Cada grupo é subdividido em chunks de linhas
   - Exemplo: 
     Grupo 1: (colA + colB) × N linhas
     Grupo 2: (colC + colD) × N linhas
   ```

### Matriz de Decisão
```
Critérios para escolha da estratégia:
1. Estrutura dos Dados
   - Número de colunas
   - Tipos de dados
   - Tamanho médio dos campos

2. Requisitos de Processamento
   - Dependências entre colunas
   - Necessidade de joins
   - Ordem de processamento

3. Limitações Técnicas
   - Limite de memória COBOL
   - Tempo máximo de processamento
   - Capacidade do banco de dados
```

### Plano de Testes
```
1. Setup do Ambiente
   - Preparar dados de teste representativos
   - Configurar monitoramento de recursos
   - Definir métricas de sucesso

2. Execução dos Testes
   - Testar cada estratégia com volumes crescentes
   - Documentar comportamento e limites
   - Identificar gargalos e pontos de falha

3. Análise e Decisão
   - Comparar resultados das diferentes estratégias
   - Definir limites seguros de operação
   - Escolher estratégia mais adequada
```

## ✅ Funções Validadas

### Operações Confirmadas
```
1. Funções Testadas com Sucesso:
   - current_user: Retorna usuário atual
   - saldo(): Retorna saldo da conta
   - Processamento de linha x coluna unica

2. Características Validadas:
   - Leitura de dados individuais funciona corretamente
   - Processamento de campos simples é estável
   - Operações com usuário atual são confiáveis
   - Consultas de saldo funcionam sem problemas
```

### Estratégia de Processamento Atualizada
```
1. Abordagem Inicial:
   - Começar com processamento de registros individuais
   - Utilizar funções validadas como base
   - Expandir gradualmente o volume

2. Fluxo de Processamento:
   - Identificar usuário (current_user)
   - Verificar saldo inicial
   - Processar registro por registro
   - Atualizar saldo conforme necessário
   - Confirmar transação

3. Controle de Partições:
   - Iniciar com partições menores
   - Usar funções validadas como checkpoints
   - Expandir baseado em resultados bem-sucedidos
```

### Próximos Passos
```
1. Expansão Gradual:
   - Testar processamento multi-linha
   - Validar operações em batch
   - Verificar limites de memória

2. Otimização:
   - Ajustar tamanho das partições
   - Implementar pontos de verificação
   - Adicionar logs de performance

3. Monitoramento:
   - Tracking de current_user por operação
   - Validação de saldo por transação
   - Registro de tempo de processamento
```

## 🎯 Estratégia Central de Processamento

### Conceito Principal
```
1. Divisão de Responsabilidades:
   - API: Orquestração e controle do processo
   - COBOL: Executor dedicado de queries
   - BD: Gerenciamento de filas e dados

2. Fluxo de Execução:
   - API divide dados em lotes de 100 caracteres
   - Cada lote é registrado na fila (event_transfer)
   - API monitora e controla execução
   - COBOL processa um item por vez
   - Resultados são consolidados em event_transfer_end
```

### Estrutura de Dados
```sql
-- Fila de Processamento
CREATE TABLE event_transfer (
    event_id SERIAL PRIMARY KEY,
    client_id INTEGER,                    -- ID do cliente
    instance_id UUID,                     -- ID da instância de processamento
    batch_data TEXT,                      -- Lote de 100 caracteres
    status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP,
    batch_order INTEGER                   -- Ordem de processamento
);

-- Resultados Processados
CREATE TABLE event_transfer_end (
    event_id INTEGER REFERENCES event_transfer(event_id),
    result_data TEXT,
    processed_by_cobol_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Fluxo Detalhado
```
1. Preparação (API):
   - Recebe dados para processamento
   - Divide em lotes de 100 caracteres
   - Cria registros na event_transfer
   - Gera instance_id único para o processo

2. Execução (API + COBOL):
   - API verifica itens PENDING
   - API chama COBOL para cada item
   - COBOL executa query específica
   - API atualiza status e resultados
   - Process repete até fila vazia

3. Finalização (API):
   - Verifica conclusão de todos os lotes
   - Consolida resultados
   - Atualiza status final da instância
   - Retorna resultado unificado
```

### Programa COBOL Simplificado
```cobol
       IDENTIFICATION DIVISION.
       PROGRAM-ID. PROCESS-QUERY.
       
       ENVIRONMENT DIVISION.
       INPUT-OUTPUT SECTION.
       
       DATA DIVISION.
       WORKING-STORAGE SECTION.
       01 WS-QUERY-DATA     PIC X(100).
       01 WS-RESULT         PIC X(100).
       
       PROCEDURE DIVISION.
           ACCEPT WS-QUERY-DATA FROM COMMAND-LINE
           
           EXEC SQL
               EXECUTE IMMEDIATE :WS-QUERY-DATA
               INTO :WS-RESULT
           END-EXEC
           
           DISPLAY WS-RESULT
           
           GOBACK.
```

### Controle de Execução (API)
```python
def process_queue(instance_id):
    while True:
        # Obtém próximo item pendente
        next_batch = get_next_pending_batch(instance_id)
        if not next_batch:
            break

        try:
            # Executa COBOL
            result = execute_cobol_query(next_batch.batch_data)
            
            # Registra resultado
            save_batch_result(next_batch.event_id, result)
            
            # Atualiza status
            update_batch_status(next_batch.event_id, 'COMPLETED')
            
        except Exception as e:
            update_batch_status(next_batch.event_id, 'ERROR')
```