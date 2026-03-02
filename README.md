# 🚀 NOME_DO_APP

Aplicação mobile desenvolvida com foco em gerenciamento de tickets em um ambiente corporativo simulado.  
O objetivo principal foi entregar uma solução funcional priorizando valor de negócio e experiência do usuário, seguindo a proposta de um MVP.

---

## 🛠️ Tecnologias Utilizadas

- **React Native**
- **Expo**
- **TypeScript**
- **NativeWind**

---

## 🎯 Decisões Técnicas

### 1. Uso de AsyncStorage

Foi utilizado **AsyncStorage** como mecanismo de persistência local, pois o desafio permitia armazenamento local e não exigia backend externo.  
Essa decisão simplificou a arquitetura e reduziu complexidade de infraestrutura.

### 2. Não criação de API externa

Optou-se por **não criar uma API externa**, centralizando toda a lógica no próprio app.  
Isso reduziu tempo de desenvolvimento e manteve o escopo alinhado à proposta do desafio.

### 3. Priorização de valor (MVP)

O foco foi tornar o aplicativo o mais funcional possível dentro do prazo, priorizando:

- Fluxo completo de autenticação
- Criação e visualização de tickets
- Regras de negócio aplicadas corretamente
- Persistência de dados

A arquitetura foi pensada para permitir evolução futura (como substituição do AsyncStorage por API real).

---

## 📁 Estrutura de Pastas

```bash
└── 📁ticket-check
    └── 📁.expo
        └── 📁types
            ├── router.d.ts
        ├── devices.json
        ├── README.md
    └── 📁.vscode
        └── 📁.react
        ├── extensions.json
        ├── settings.json
    └── 📁app
        └── 📁(auth)
            ├── _layout.tsx
            ├── login.tsx
            ├── register.tsx
        └── 📁(tabs)
            └── 📁dashboard
                ├── index.tsx
            └── 📁newTicket
                ├── index.tsx
            └── 📁settings
                ├── index.tsx
            └── 📁tickets
                ├── [id].tsx
                ├── index.tsx
            ├── _layout.tsx
            ├── index.tsx
        ├── _layout.tsx
    └── 📁assets
        └── 📁images
            ├── android-icon-background.png
            ├── android-icon-foreground.png
            ├── android-icon-monochrome.png
            ├── favicon.png
            ├── icon.png
            ├── partial-react-logo.png
            ├── react-logo.png
            ├── react-logo@2x.png
            ├── react-logo@3x.png
            ├── splash-icon.png
    └── 📁components
        └── 📁metricsCharts
            ├── metricCards.tsx
            ├── metrricCharts.tsx
        └── 📁statusPieChart
            ├── StatusPieChart.tsx
        └── 📁TicketCard
            ├── styles.ts
            ├── TicketCard.tsx
        └── 📁ticketCarrossel
            ├── paginationDot.tsx
            ├── styles.ts
            ├── ticketCardCarrossel.tsx
        └── 📁ui
            ├── icon-symbol.ios.tsx
            ├── icon-symbol.tsx
        ├── AuthProvider.tsx
        ├── divider.tsx
        ├── external-link.tsx
        ├── FormInputRHF.tsx
        ├── haptic-tab.tsx
        ├── hello-wave.tsx
        ├── infoRow.tsx
        ├── navbar.tsx
        ├── ThemeToggleButton.tsx
        ├── ticketsCarrossel.tsx
    └── 📁constants
        ├── theme.ts
    └── 📁context
        ├── ThemeContext.tsx
    └── 📁hooks
    └── 📁lib
        └── 📁repositories
            ├── index.ts
            ├── tickets.repository.ts
            ├── users.repository.ts
        └── 📁storage
            ├── async-storage.ts
            ├── auth-session.ts
            ├── index.ts
            ├── safe-parse.ts
            ├── storage-keys.ts
        └── 📁types
            ├── fatherName.ts
            ├── pageTypes.ts
        └── 📁utils
            ├── formarters.ts
            ├── masks.ts
            ├── ticket.utils.ts
            ├── ticketGuard.ts
        └── 📁validations
            ├── regex.ts
            ├── ticket.schema.ts
            ├── user.schema.ts
    └── 📁scripts
        ├── reset-project.js
    └── 📁styles
        ├── formStyle.ts
        ├── TicketCardStyles.ts
        ├── TicketStatusConfig.ts
        ├── ticketStyles.ts
    ├── .gitignore
    ├── app.json
    ├── babel.config.js
    ├── eslint.config.js
    ├── expo-env.d.ts
    ├── global.css
    ├── metro.config.js
    ├── nativewind-env.d.ts
    ├── package-lock.json
    ├── package.json
    ├── README.md
    ├── tailwind.config.js
    └── tsconfig.json
```

---

## 📌 Regras de Negócio

### 🔐 Autenticação

- Usuários precisam estar autenticados para utilizar o sistema.
- Não é possível interagir com tickets sem login.

---

### 👤 Contrato de Usuário

```ts
type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
};
```

#### Retorno do Usuário

Por motivos de segurança:

- O campo `password` é ocultado ao retornar o usuário.
- São adicionados os campos:
  - `createdAt: Date`
  - `updatedAt: Date`

---

### 🎟️ Regras sobre Tickets

#### 1. Criação

Qualquer usuário autenticado pode criar um ticket.

Contrato necessário:

```ts
type CreateTicketDTO = {
  title: string; // título do ticket
  details: string; // detalhes do problema
  requester: string; // nome de quem solicitou
  requesterId: string; // id do solicitante (relacionamento)
  deadline: string; // prazo para solução
};
```

- Todo ticket nasce com status `"ABERTO"`.

---

#### 2. Visualização

- Todos os usuários podem visualizar tickets criados por outros usuários.
- Tickets são públicos dentro do sistema.

---

#### 3. Resolução

Um ticket **não pode ser resolvido pelo mesmo usuário que o criou**.

Motivação:

Simular um ambiente empresarial real.  
Exemplo: se um colaborador do RH estiver com vírus no computador, ele não conseguirá resolver o próprio problema — será necessário o suporte técnico.

Contrato para atualização:

```ts
type UpdateTicketDTO = {
  title?: string;
  details?: string;
  requester?: string;
  deadline?: string;
  status?: "ABERTO" | "ACEITO" | "ENCERRADO" | "CANCELADO" | "IMPROCEDENTE";
  provider?: string;
  providerId?: string;
  closingDetails?: string;
};
```

---

## 📊 Fluxo do Sistema

1. Usuário realiza login
2. Usuário cria ticket (status inicial: ABERTO)
3. Outro usuário pode aceitar e resolver o ticket
4. Ticket pode evoluir entre os status definidos

---

## 📱 Imagens da Aplicação

Para adicionar imagens no README, utilize o padrão:

```md
![Tela de Login](./assets/login.png)
![Lista de Tickets](./assets/tickets.png)
![Detalhes do Ticket](./assets/details.png)
```

Se as imagens estiverem na raiz:

```md
![Home](./home.png)
```

---

## 🚀 Possíveis Evoluções Futuras

- Integração com API REST real
- Autenticação com JWT
- Persistência em banco de dados
- Controle de permissões por perfil
- Paginação de tickets
- Filtros por status
- Push notifications

---

## 🧠 Considerações Finais

O projeto foi estruturado como um MVP funcional, com regras de negócio claras e arquitetura preparada para evolução futura.  
As decisões técnicas priorizaram simplicidade, organização e entrega de valor dentro do escopo proposto.
