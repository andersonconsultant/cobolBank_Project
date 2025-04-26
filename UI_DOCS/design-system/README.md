# cobolBank Design System

Este é o novo design system do cobolBank, criado para modernizar e padronizar a interface do usuário, reduzindo a carga cognitiva e melhorando a experiência do usuário.

## Estrutura

```
design-system/
├── tokens.css      # Variáveis CSS (cores, tipografia, espaçamento, etc.)
├── components.css  # Estilos base dos componentes
├── migrations/     # Arquivos de migração para compatibilidade
└── README.md      # Documentação
```

## Como Usar

1. **Importação dos Arquivos**
   ```html
   <link rel="stylesheet" href="/UI/design-system/tokens.css">
   <link rel="stylesheet" href="/UI/design-system/components.css">
   <link rel="stylesheet" href="/UI/design-system/migrations/button-migration.css">
   ```

2. **Uso dos Botões**
   
   Botão Primário:
   ```html
   <button class="cb-btn cb-btn--primary">Botão Primário</button>
   ```

   Botão Secundário:
   ```html
   <button class="cb-btn cb-btn--secondary">Botão Secundário</button>
   ```

   Botão com Ícone:
   ```html
   <button class="cb-btn cb-btn--primary cb-btn--icon">
     <i class="fas fa-arrow-right"></i>
     <span>Continuar</span>
   </button>
   ```

   Tamanhos de Botão:
   ```html
   <button class="cb-btn cb-btn--primary cb-btn--sm">Pequeno</button>
   <button class="cb-btn cb-btn--primary">Normal</button>
   <button class="cb-btn cb-btn--primary cb-btn--lg">Grande</button>
   ```

   Botão Desabilitado:
   ```html
   <button class="cb-btn cb-btn--primary" disabled>Desabilitado</button>
   ```

   Botão de Menu (Sidebar):
   ```html
   <button class="cb-btn sidebar-button">
     <i class="fas fa-home"></i>
     <span>Início</span>
   </button>
   ```

   Cards:
   ```html
   <div class="cb-card">Conteúdo do Card</div>
   <div class="cb-card cb-card--elevated">Card com Elevação</div>
   ```

   Inputs:
   ```html
   <input type="text" class="cb-input" placeholder="Digite aqui...">
   ```

## Variáveis CSS Disponíveis

### Cores
- `--cb-primary`: #0077b6
- `--cb-secondary`: #6C757D
- `--cb-success`: #2cb556
- `--cb-error`: #dc3545

### Espaçamento
- `--cb-space-1`: 4px
- `--cb-space-2`: 8px
- `--cb-space-3`: 12px
- `--cb-space-4`: 16px

### Tipografia
- `--cb-font-family-primary`: Inter
- `--cb-font-family-secondary`: SF Pro Display

## Migração Gradual

Para garantir uma transição suave:

1. Comece aplicando as novas classes em componentes novos
2. Ao modificar componentes existentes, atualize para o novo padrão
3. Use as variáveis CSS para manter consistência
4. Teste em todas as resoluções antes de fazer deploy

## Acessibilidade

- Todos os componentes seguem WCAG 2.1 AA
- Use sempre os estados de foco apropriados
- Mantenha contraste adequado usando as cores definidas
- Teste com leitores de tela

## Próximos Passos

1. Implementar componentes em novas features
2. Migrar componentes existentes gradualmente
3. Coletar feedback dos desenvolvedores
4. Expandir biblioteca de componentes

## Contribuição

1. Siga os padrões estabelecidos
2. Documente novos componentes
3. Teste em diferentes resoluções
4. Valide acessibilidade 