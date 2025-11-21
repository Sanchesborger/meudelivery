# DeliveryX Customer App 🍕

Aplicativo de delivery de comida desenvolvido com Next.js 14, TypeScript, Tailwind CSS e Supabase.

## 🚀 Tecnologias

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização com design system customizado
- **Supabase** - Backend (autenticação, banco de dados, realtime)
- **Framer Motion** - Animações
- **Lucide Icons** - Ícones
- **Zustand** - Gerenciamento de estado
- **Mapbox** - Mapas e geolocalização

## 📋 Funcionalidades

### ✅ Implementadas

- 🏠 **Home** - Lista de restaurantes com busca e filtros por categoria
- 🍽️ **Restaurante** - Detalhes do restaurante e cardápio
- 🛒 **Carrinho** - Gerenciamento de itens com quantidades
- 👤 **Perfil** - Dados do usuário e configurações
- 📦 **Pedidos** - Histórico de pedidos

### 🚧 Em Desenvolvimento

- 🔐 Autenticação (Phone OTP, Google, Apple)
- 💳 Checkout e pagamento
- 📍 Rastreamento de pedido em tempo real
- 💬 Chat com restaurante/entregador
- 📍 Gerenciamento de endereços
- ⭐ Sistema de favoritos

## 🛠️ Instalação

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta no Supabase (para backend)
- Chave de API do Mapbox (para mapas)

### Passos

1. **Clone o repositório**
```bash
cd meudelivery
```

2. **Instale as dependências**
```bash
npm install --legacy-peer-deps
```

3. **Configure as variáveis de ambiente**

Copie o arquivo `env.example` para `.env.local`:
```bash
cp env.example .env.local
```

Edite `.env.local` e adicione suas credenciais:
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
NEXT_PUBLIC_MAPBOX_TOKEN=seu_token_do_mapbox
```

4. **Execute o servidor de desenvolvimento**
```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## 📁 Estrutura do Projeto

```
src/
├── app/                    # Páginas Next.js (App Router)
│   ├── (app)/             # Grupo de rotas com layout
│   │   ├── cart/          # Página do carrinho
│   │   ├── orders/        # Lista de pedidos
│   │   ├── profile/       # Perfil do usuário
│   │   └── restaurant/    # Detalhes do restaurante
│   ├── layout.tsx         # Layout raiz
│   └── page.tsx           # Página inicial
├── components/
│   ├── ui/                # Componentes base reutilizáveis
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── header.tsx
│   │   ├── footer-nav.tsx
│   │   ├── restaurant-card.tsx
│   │   └── ...
│   └── modules/           # Componentes de funcionalidades
├── hooks/                 # Custom hooks
│   ├── use-cart.ts        # Hook do carrinho
│   └── ...
├── lib/                   # Utilitários e configurações
│   ├── supabase/          # Cliente Supabase
│   ├── utils.ts           # Funções utilitárias
│   └── constants.ts       # Constantes da aplicação
├── types/                 # Tipos TypeScript
│   ├── database.ts        # Tipos do banco de dados
│   └── index.ts           # Tipos da aplicação
└── services/              # Serviços de API
```

## 🎨 Design System

### Cores

- **Primary**: Vermelho (#ef4444) - Ações principais
- **Secondary**: Amarelo (#eab308) - Destaques
- **Accent**: Verde (#22c55e) - Sucesso
- **Neutral**: Cinza - Textos e backgrounds

### Tipografia

- **Headings**: Sora (Google Fonts)
- **Body**: Inter (Google Fonts)

### Componentes UI

Todos os componentes seguem o design system e incluem:
- Variantes (primary, secondary, outline, ghost)
- Tamanhos (sm, md, lg)
- Estados (hover, active, disabled, loading)
- Suporte a tema claro/escuro

## 🗄️ Banco de Dados (Supabase)

### Tabelas Principais

- `users` - Usuários
- `addresses` - Endereços de entrega
- `restaurants` - Restaurantes
- `menu_items` - Itens do cardápio
- `orders` - Pedidos
- `order_items` - Itens dos pedidos
- `couriers` - Entregadores
- `favorites` - Favoritos

## 📱 Responsividade

O app é totalmente responsivo e otimizado para:
- 📱 Mobile (375px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)

## 🧪 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar produção
npm run start

# Verificação de tipos
npm run type-check

# Lint
npm run lint
```

## 🔐 Autenticação

O app suporta múltiplos métodos de autenticação via Supabase:
- 📱 Telefone (OTP via SMS)
- 🔵 Google OAuth
- 🍎 Apple OAuth

## 🗺️ Mapas

Integração com Mapbox para:
- Visualização de restaurantes no mapa
- Rastreamento de entregador em tempo real
- Cálculo de distância e rotas

## 📦 Estado Global

Gerenciamento de estado com Zustand:
- **Cart Store**: Carrinho de compras com persistência local
- Sincronização automática com localStorage

## 🎯 Próximos Passos

1. ✅ Implementar autenticação completa
2. ✅ Integração com Supabase Realtime para tracking
3. ✅ Sistema de pagamentos (PIX, Cartão)
4. ✅ Chat em tempo real
5. ✅ Notificações push
6. ✅ Sistema de avaliações
7. ✅ Cupons de desconto

## 📄 Licença

Este projeto é privado e proprietário.

## 👨‍💻 Desenvolvido por

DeliveryX Team

---

**Nota**: Este é um projeto em desenvolvimento ativo. Algumas funcionalidades podem estar incompletas ou em fase de testes.
