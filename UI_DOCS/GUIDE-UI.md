# 🎨 GUIDE-UI: Sistema de Design CobolBank

## 📁 Estrutura da Documentação UI

```
UI/
├── wireframes/     # Desenhos básicos das telas
├── mockups/        # Designs detalhados
├── assets/         # Recursos visuais reutilizáveis
│   ├── icons/      # Ícones do sistema
│   ├── logos/      # Variações da marca
│   └── images/     # Imagens de interface
├── components/     # Exemplos visuais de componentes
└── GUIDE-UI.md    # Esta documentação
```

## 🎯 Propósito

Este guia serve como fonte única da verdade para todos os aspectos visuais do CobolBank, garantindo consistência e qualidade em toda a interface do usuário.

## 🎨 Sistema de Design

### Cores
```css
/* Cores Principais */
--primary: #1A73E8;      /* Ações principais, links */
--secondary: #6C757D;    /* Elementos secundários */
--accent: #34A853;       /* Destaque, sucesso */

/* Tons de Cinza */
--gray-100: #F8F9FA;     /* Background leve */
--gray-200: #E9ECEF;     /* Bordas, separadores */
--gray-800: #343A40;     /* Textos */

/* Estados */
--success: #28A745;      /* Operações bem-sucedidas */
--warning: #FFC107;      /* Alertas */
--danger: #DC3545;       /* Erros, ações destrutivas */
--info: #17A2B8;        /* Informações */
```

### Tipografia
```css
/* Família */
--font-primary: 'Inter', sans-serif;
--font-secondary: 'SF Pro Display', sans-serif;

/* Tamanhos */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
```

### Espaçamento
```css
/* Sistema de 4px */
--space-1: 0.25rem;    /* 4px */
--space-2: 0.5rem;     /* 8px */
--space-3: 0.75rem;    /* 12px */
--space-4: 1rem;       /* 16px */
--space-6: 1.5rem;     /* 24px */
--space-8: 2rem;       /* 32px */
```

## 🧩 Componentes Base

### Botões
- Primário: Ações principais
- Secundário: Ações alternativas
- Ghost: Ações terciárias
- Danger: Ações destrutivas

### Inputs
- Text
- Number
- Password
- Select
- Checkbox
- Radio
- Toggle

### Cards
- Padrão
- Destacado
- Interativo
- Status

### Feedback
- Success Toast
- Error Alert
- Warning Message
- Info Notification

## 📱 Responsividade

### Breakpoints
```css
--mobile: 320px;
--tablet: 768px;
--desktop: 1024px;
--wide: 1280px;
```

### Grid System
- Container: 1200px max-width
- 12 colunas
- Gutters: 24px
- Responsivo em todos breakpoints

## 🎭 Estados

### Interação
- Default
- Hover
- Active
- Focus
- Disabled

### Loading
- Skeleton
- Spinner
- Progress Bar
- Shimmer Effect

## 🖼️ Iconografia

### Sistema de Ícones
- 24x24px grid base
- 2px stroke
- Rounded corners
- Consistent padding

### Categorias
- Navigation
- Actions
- Status
- File types
- Social

## 📐 Layout Guidelines

### Hierarquia Visual
1. Cabeçalho principal
2. Navegação
3. Conteúdo primário
4. Ações secundárias
5. Rodapé

### Espaçamento
- Consistente entre seções
- Respiro adequado para conteúdo
- Agrupamento lógico
- Alinhamento em grid

## ♿ Acessibilidade

### Contraste
- AA compliance mínimo
- Textos legíveis
- Ícones identificáveis
- Estados visíveis

### Interação
- Focus visible
- Touch targets adequados
- Keyboard navigation
- Screen reader support

## 📱 Variações Mobile

### Adaptações
- Touch-first design
- Larger touch targets
- Simplified navigation
- Bottom sheets

## 🔄 Versionamento

### Processo
1. Designs em Figma
2. Exportação de assets
3. Documentação de mudanças
4. Implementação em código

## 📸 Screenshots e Exemplos

> Nota: As imagens de exemplo serão adicionadas nas respectivas pastas:
- `/wireframes` - Estruturas básicas
- `/mockups` - Designs finalizados
- `/components` - Componentes isolados
- `/assets` - Recursos visuais

## 🔗 Links Úteis

- [Figma Project](link-para-figma) - Designs atuais
- [Storybook](link-para-storybook) - Componentes documentados
- [Protótipo](link-para-prototype) - Versão interativa

---

*Este guia está em constante evolução. Conforme o design system cresce, novas seções e exemplos serão adicionados.* 