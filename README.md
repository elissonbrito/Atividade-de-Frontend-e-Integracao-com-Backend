# Sistema Fullstack — API + Frontend

> Node.js · Express · MongoDB · PostgreSQL · React · Tailwind CSS · JWT · Docker

---

## Sumário

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Tecnologias](#tecnologias)
- [Segurança (OWASP)](#segurança-owasp)
- [Como Executar com Docker](#como-executar-com-docker)
- [Rodar os Testes](#rodar-os-testes)
- [Documentação da API (Swagger)](#documentação-da-api-swagger)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Documentação Escrita](#documentação-escrita)

---

## Visão Geral

Aplicação fullstack com:

- **Backend**: API RESTful Node.js/Express com dois contextos de persistência: MongoDB (carros, motos, marcas de roupa) e PostgreSQL (usuários).
- **Frontend**: SPA React + Tailwind CSS que consome a API via JWT, com telas de login, dashboard e CRUD completo para todos os recursos.
- **Infraestrutura**: Docker + Docker Compose orquestrando todos os serviços.

---

## Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                     Docker Network                       │
│                                                         │
│  ┌──────────┐    ┌──────────┐    ┌──────────────────┐  │
│  │ Frontend │───▶│ Backend  │───▶│    MongoDB       │  │
│  │  React   │    │ Express  │    │  (carros, motos, │  │
│  │ :80      │    │  :3001   │    │   marcas roupa)  │  │
│  └──────────┘    └────┬─────┘    └──────────────────┘  │
│                       │                                  │
│                       │          ┌──────────────────┐   │
│                       └─────────▶│   PostgreSQL     │   │
│                                  │   (usuários)     │   │
│                                  └──────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

O Nginx do container frontend faz proxy das requisições `/api/` para o backend internamente na rede Docker, mantendo a comunicação segura sem expor portas desnecessárias.

---

## Tecnologias

### Backend

| Tecnologia | Uso |
|---|---|
| **Node.js 20** | Runtime JavaScript server-side |
| **Express 4** | Framework HTTP minimalista |
| **Mongoose 8** | ODM para MongoDB — modelos de Carro, Moto e MarcaRoupa |
| **Sequelize 6** | ORM para PostgreSQL — modelo de Usuário |
| **JSON Web Token (JWT)** | Autenticação stateless com `jsonwebtoken` |
| **bcryptjs** | Hash seguro de senhas com salt rounds = 12 |
| **Joi** | Validação de schema dos dados recebidos |
| **Helmet** | Headers HTTP de segurança |
| **express-rate-limit** | Limitação de requisições (rate limiting) |
| **express-mongo-sanitize** | Prevenção de NoSQL Injection |
| **swagger-jsdoc + swagger-ui-express** | Documentação automática OpenAPI 3.0 |
| **Jest + Supertest** | Testes de integração por endpoint |

### Frontend

| Tecnologia | Uso |
|---|---|
| **React 18** | UI declarativa com hooks |
| **React Router DOM 6** | Roteamento SPA com rotas protegidas |
| **Tailwind CSS 3** | Estilização utility-first responsiva |
| **Axios** | Cliente HTTP com interceptors para JWT |
| **react-hot-toast** | Feedback de sucesso/erro ao usuário |
| **Vite 5** | Build tool rápido para React |

### Infraestrutura

| Tecnologia | Uso |
|---|---|
| **Docker** | Containerização de todos os serviços |
| **Docker Compose** | Orquestração multi-container |
| **Nginx** | Servidor do frontend + proxy reverso para API |
| **MongoDB 7** | Banco NoSQL para recursos dinâmicos |
| **PostgreSQL 16** | Banco relacional para controle de usuários |

---

## Segurança (OWASP)

A aplicação aplica controles contra as principais vulnerabilidades do **OWASP Top 10**:

| OWASP | Controle Implementado |
|---|---|
| A01 - Broken Access Control | JWT + middleware `authenticate` + `authorize(role)` |
| A02 - Cryptographic Failures | Senhas com bcrypt (salt 12), JWT com secret forte |
| A03 - Injection | `express-mongo-sanitize` (NoSQL), validação Joi (SQL via ORM parametrizado) |
| A04 - Insecure Design | Rate limiting geral (200/15min) e específico no login (20/15min) |
| A05 - Security Misconfiguration | `helmet` para headers HTTP seguros, CORS restrito |
| A06 - Vulnerable Components | Dependências produção mínimas, `npm ci` no Docker |
| A07 - Auth Failures | Token JWT com expiração, validação em toda rota protegida |
| A08 - Integrity Failures | Body limitado a 10kb, dados validados por schema Joi |

---

## Como Executar com Docker

### Pré-requisitos

- Docker >= 24.x
- Docker Compose >= 2.x

### Passos

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/projeto-fullstack.git
cd projeto-fullstack

# 2. Copie e ajuste o .env (opcional — valores padrão já estão no docker-compose.yml)
cp .env.example .env

# 3. Suba todos os containers
docker compose up --build -d

# 4. Acompanhe os logs
docker compose logs -f backend

# 5. Acesse a aplicação
# Frontend:  http://localhost:80
# API Docs:  http://localhost:3001/api-docs
# API:       http://localhost:3001
```

### Parar a aplicação

```bash
docker compose down

# Para remover volumes (dados dos bancos):
docker compose down -v
```

---

## Rodar os Testes

Os testes rodam em container separado, usando bancos isolados (`api_test`):

```bash
# Garanta que MongoDB e PostgreSQL estejam rodando
docker compose up mongo postgres -d

# Rode o container de testes
docker compose --profile test run --rm tests
```

Ou localmente (necessita MongoDB e PostgreSQL rodando):

```bash
cd backend
cp .env.example .env  # ajuste MONGO_URI e POSTGRES_*
npm install
npm test
```

---

## Documentação da API (Swagger)

Com a aplicação rodando, acesse:

```
http://localhost:3001/api-docs
```

A documentação interativa OpenAPI 3.0 cobre todos os endpoints com exemplos de request/response, campos obrigatórios e autenticação JWT integrada (botão "Authorize" → insira `Bearer <token>`).

---

## Variáveis de Ambiente

Veja o arquivo `.env.example` na raiz do projeto. As principais:

| Variável | Descrição | Padrão |
|---|---|---|
| `JWT_SECRET` | Chave secreta JWT — **troque em produção!** | — |
| `JWT_EXPIRES_IN` | Expiração do token | `24h` |
| `MONGO_URI` | URI de conexão MongoDB | `mongodb://mongo:27017/api_db` |
| `POSTGRES_HOST` | Host do PostgreSQL | `postgres` |
| `POSTGRES_DB` | Nome do banco SQL | `api_users` |
| `VITE_API_URL` | URL da API consumida pelo frontend | `http://localhost:3001` |

---

## Estrutura de Pastas

```
projeto-fullstack/
├── backend/
│   ├── src/
│   │   ├── config/         # Conexões MongoDB, PostgreSQL, Swagger
│   │   ├── controllers/    # Lógica de negócio (auth, users, CRUD factory)
│   │   ├── middleware/     # JWT auth, validação Joi
│   │   ├── models/         # User (Sequelize), Carro/Moto/MarcaRoupa (Mongoose)
│   │   ├── routes/         # Rotas Express com JSDoc Swagger
│   │   ├── tests/          # Testes de integração Jest + Supertest
│   │   ├── app.js          # Express app (middlewares, rotas)
│   │   └── server.js       # Entry point (conecta DBs e inicia servidor)
│   ├── Dockerfile
│   ├── Dockerfile.test
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Layout, Navbar, CrudPage genérico, componentes UI
│   │   ├── context/        # AuthContext (JWT + estado do usuário)
│   │   ├── pages/          # Login, Dashboard, Carros, Motos, MarcasRoupa, Usuarios
│   │   ├── services/       # api.js (Axios + services por recurso)
│   │   ├── App.jsx         # Roteamento principal
│   │   └── main.jsx        # Entry point React
│   ├── Dockerfile          # Multi-stage: build Vite → Nginx
│   ├── nginx.conf          # SPA fallback + proxy /api → backend
│   └── package.json
│
├── docker-compose.yml      # Orquestração: mongo, postgres, backend, frontend, tests
├── .env.example
└── README.md
```

---

## Documentação Escrita

Este projeto foi desenvolvido como uma aplicação fullstack completa integrando backend e frontend em containers Docker. O backend foi construído com **Node.js e Express**, adotando dois contextos distintos de persistência de dados: **MongoDB** via Mongoose para os recursos dinâmicos (carros, motos e marcas de roupa), aproveitando a flexibilidade do NoSQL para schemas variáveis; e **PostgreSQL** via Sequelize para o gerenciamento de usuários, onde a consistência relacional é essencial.

A autenticação foi implementada com **JWT (JSON Web Token)**, onde o token é gerado no login ou registro, armazenado no frontend via `localStorage` e enviado em todas as requisições protegidas através do header `Authorization: Bearer`. No backend, um middleware de autenticação valida o token em cada rota e extrai o usuário; um segundo middleware de autorização restringe rotas administrativas ao perfil `admin`.

A segurança foi tratada com base no **OWASP Top 10**: o `helmet` configura headers HTTP seguros; o `express-mongo-sanitize` previne injeção NoSQL; o `express-rate-limit` protege contra ataques de força bruta com limites diferenciados por rota; a validação com **Joi** garante que apenas dados bem formados cheguem ao banco; e as senhas são armazenadas com **bcryptjs** usando 12 rounds de salt.

A documentação automática da API foi gerada com **Swagger** (swagger-jsdoc + swagger-ui-express), permitindo testar todos os endpoints diretamente no navegador em `/api-docs`. Os **testes de integração** foram escritos com **Jest e Supertest**, cobrindo todos os endpoints — autenticação, usuários, carros, motos e marcas de roupa — em cenários de sucesso e de erro, incluindo testes de acesso negado e validação de dados.

O frontend foi desenvolvido com **React 18** e **Tailwind CSS**, organizado em páginas, componentes e serviços. O componente `CrudPage` é genérico e reutilizável: recebe uma configuração declarativa com os campos do formulário, colunas da tabela e service de API, eliminando repetição de código entre as três entidades NoSQL. O `AuthContext` centraliza o estado de autenticação e a injeção automática do token via interceptors do **Axios**. A responsividade foi garantida com classes utilitárias do Tailwind e o menu de navegação adaptativo para mobile.

Toda a aplicação é executada via **Docker Compose**, com healthchecks garantindo a ordem correta de inicialização: os bancos sobem primeiro, depois o backend (que aguarda os bancos estarem saudáveis), e por último o frontend. O container do frontend usa uma build **multi-stage** — Vite compila o bundle estático no estágio de build, e o **Nginx** serve os arquivos e faz proxy reverso das requisições `/api/` para o backend internamente na rede Docker, sem expor o backend diretamente ao usuário. Um profile separado (`test`) permite rodar os testes isoladamente sem interferir nos containers de produção.
