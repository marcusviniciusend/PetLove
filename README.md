# PetTinder 🐾

Um aplicativo mobile focado no encontro de pets para acasalamento, desenvolvido como projeto de extensão universitária (iCEV). O objetivo é conectar tutores que buscam o par ideal para seus animais de estimação, facilitando a continuidade da linhagem e o cuidado genético.

---

## Arquitetura

O PetTinder segue uma arquitetura modular em React Native para garantir escalabilidade, com gerenciamento de estado global e tipagem estática rigorosa:

```text
src/
├── hooks/
│   ├── useMatches.ts     # Hook para lógica e carregamento da lista de matches
│   └── useSwipe.ts       # Hook para gerenciamento do baralho de pets e loading
├── lib/
│   └── supabase.ts       # Configuração e conexão com o cliente Supabase
├── screens/
│   ├── MatchesScreen.tsx # Listagem de conexões estabelecidas e chat
│   ├── ProfileScreen.tsx # Gerenciamento das informações do pet e do tutor
│   └── SwipeScreen.tsx   # Tela de descoberta com mecânica de Match/Pass
├── services/
│   ├── chatService.ts    # Comunicação com o banco para troca de mensagens
│   ├── matchService.ts   # Persistência de interações (likes/dislikes)
│   └── petService.ts     # Serviço de consulta ao catálogo de pets
├── stores/
│   ├── authStore.ts      # Estado global de autenticação do usuário
│   ├── chatStore.ts      # Estado global das conversas ativas
│   └── swipeStore.ts     # Estado global das métricas e fila de swipe
├── types/
│   └── env.d.ts          # Definições de tipagem para variáveis de ambiente
└── utils/
    ├── lgpd.ts           # Tratamento de dados e consentimento (Lei Geral de Proteção de Dados)
    └── notifications.ts  # Configuração e disparo de notificações push
```

---
 
## Tech Stack
 
| Responsabilidade | Tecnologia / Pacote |
|---|---|
| Framework UI | React Native (TypeScript) |
| Identidade visual | Tema PetTinder (`#FA2A55`) |
| Navegação | `@react-navigation/bottom-tabs` |
| Mecânica de swipe | `react-native-deck-swiper` |
| Estado global | Zustand / Context API (via `stores/`) |
| Backend / Database | Supabase (PostgreSQL) |
| Configuração | `react-native-dotenv` |
 
---
 
## Funcionalidades

### Swipe Screen
* Feed de cards de pets para deslizar (like / dislike)
* Overlay visual de ♥ e ✕ durante o gesto
* Detecção automática de match mútuo
* Modal de celebração ao confirmar um match

### Matches Screen
* Lista completa de matches realizados
* Foto, nome e raça do pet parceiro
* Botão de acesso direto ao chat de cada match

### Profile Screen
* Cadastro e edição de perfil do tutor
* Registro de pets com foto, raça, idade e bio
* Fluxo de consentimento LGPD no onboarding
* Opção de exclusão de conta (art. 18 LGPD)

### Chat
* Mensagens em tempo real via Supabase Realtime
* Histórico persistido por conversa
* Indicador de mensagem lida

---

## Pré-requisitos
 
- Node.js 18+
- Expo CLI
- Conta no [Supabase](https://supabase.com)
- Android Studio ou Xcode (para emulador)

---

## Getting Started
 
```bash
# 1. Clone o repositório
git clone https://github.com/marcusviniciusend/PetTinder
cd pettinder
 
# 2. Instale as dependências
npm install
 
# 3. Configure as variáveis de ambiente
cp .env.example .env
# Preencha SUPABASE_URL e SUPABASE_ANON_KEY no .env
 
# 4. Execute o app
npx expo start
```
 
Para rodar diretamente no emulador Android:
 
```bash
npx expo run:android
```
 
---

## Licença
 
Este projeto foi desenvolvido como projeto de extensão universitária no **iCEV**

---
 
> Desenvolvido com 🐾 para conectar tutores e seus pets.
 