# API Backend — Node.js + Express + MongoDB + PostgreSQL

> Autenticação JWT · CRUD completo · Swagger · Testes de integração · Docker

---

## Sumário

- [Visão Geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Como Executar](#como-executar)
- [Rodando os Testes](#rodando-os-testes)
- [Documentação Swagger](#documentação-swagger)
- [Endpoints da API](#endpoints-da-api)
- [Segurança OWASP](#segurança-owasp)

---

## Visão Geral

API RESTful desenvolvida com **Node.js e Express** cobrindo dois contextos distintos de persistência de dados:

- **MongoDB** (NoSQL) — recursos de `carros`, `motos` e `marcas de roupa`
- **PostgreSQL** (SQL relacional) — gerenciamento de `usuários`

A aplicação implementa autenticação e autorização com **JWT**, proteção de rotas baseada em perfil (`user` / `admin`), validação de dados com **Joi**, documentação automática com **Swagger** e testes de integração completos com **Jest + Supertest**.

---

## Tecnologias

| Tecnologia | Versão | Finalidade |
|---|---|---|
| Node.js | 20 | Runtime JavaScript |
| Express | 4 | Framework HTTP |
| Mongoose | 8 | ODM para MongoDB |
| Sequelize | 6 | ORM para PostgreSQL |
| jsonwebtoken | 9 | Autenticação JWT |
| bcryptjs | 2 | Hash seguro de senhas |
| Joi | 17 | Validação de schema |
| Helmet | 7 | Headers HTTP seguros |
| express-rate-limit | 7 | Proteção contra brute force |
| express-mongo-sanitize | 2 | Prevenção de NoSQL Injection |
| swagger-jsdoc | 6 | Geração do spec OpenAPI |
| swagger-ui-express | 5 | Interface visual da documentação |
| Jest | 29 | Framework de testes |
| Supertest | 6 | Testes de integração HTTP |

---

## Estrutura de Pastas

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js       # Conexões MongoDB e PostgreSQL
│   │   └── swagger.js        # Configuração OpenAPI 3.0
│   ├── controllers/
│   │   ├── authController.js # Register, login, me
│   │   ├── userController.js # CRUD de usuários
│   │   └── crudController.js # Factory genérica para recursos NoSQL
│   ├── middleware/
│   │   ├── auth.js           # authenticate (JWT) + authorize (RBAC)
│   │   └── validate.js       # Validação Joi por endpoint
│   ├── models/
│   │   ├── User.js           # Sequelize — PostgreSQL
│   │   ├── Carro.js          # Mongoose — MongoDB
│   │   ├── Moto.js           # Mongoose — MongoDB
│   │   └── MarcaRoupa.js     # Mongoose — MongoDB
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── carroRoutes.js
│   │   ├── motoRoutes.js
│   │   └── marcaRoupaRoutes.js
│   ├── tests/
│   │   ├── setup.js           # Configuração do ambiente de teste
│   │   ├── auth.test.js       # Testes de autenticação
│   │   ├── users.test.js      # Testes de usuários
│   │   ├── carros.test.js     # Testes de carros
│   │   ├── motos.test.js      # Testes de motos
│   │   └── marcasRoupa.test.js # Testes de marcas de roupa
│   ├── app.js                 # Express + middlewares + rotas
│   └── server.js              # Entry point — conecta DBs e inicia servidor
├── Dockerfile
├── Dockerfile.test
├── .env.example
└── package.json
```

---

## Variáveis de Ambiente

Copie o arquivo de exemplo e ajuste os valores:

```bash
cp .env.example .env
```

| Variável | Descrição | Padrão |
|---|---|---|
| `NODE_ENV` | Ambiente (`development` / `production` / `test`) | `development` |
| `PORT` | Porta do servidor | `3001` |
| `JWT_SECRET` | Chave secreta JWT — **troque em produção!** | — |
| `JWT_EXPIRES_IN` | Tempo de expiração do token | `24h` |
| `MONGO_URI` | URI de conexão MongoDB | `mongodb://mongo:27017/api_db` |
| `POSTGRES_HOST` | Host do PostgreSQL | `postgres` |
| `POSTGRES_PORT` | Porta do PostgreSQL | `5432` |
| `POSTGRES_DB` | Nome do banco de dados | `api_users` |
| `POSTGRES_USER` | Usuário do banco | `pguser` |
| `POSTGRES_PASSWORD` | Senha do banco | `pgpassword` |

---

## Como Executar

### Via Docker (recomendado — fluxo principal)

Na raiz do projeto (onde está o `docker-compose.yml`):

```bash
# Subir todos os serviços
docker compose up --build -d

# Verificar se o backend está saudável
docker compose logs -f backend

# Parar tudo
docker compose down
```

A API estará disponível em `http://localhost:3001`.

### Localmente (desenvolvimento)

Requer MongoDB e PostgreSQL rodando localmente.

```bash
npm install
cp .env.example .env   # ajuste as variáveis
npm run dev            # nodemon com hot-reload
```

---

## Rodando os Testes

### Via Docker (recomendado)

```bash
# Na raiz do projeto — sobe apenas os bancos
docker compose up mongo postgres -d

# Roda o container de testes e encerra
docker compose --profile test run --rm tests
```

### Localmente

Com MongoDB e PostgreSQL rodando, crie os bancos de teste e execute:

```bash
# No seu PostgreSQL local, crie o usuário e o banco:
# CREATE USER pguser WITH PASSWORD 'pgpassword';
# CREATE DATABASE api_test OWNER pguser;

# Suba o MongoDB local (ou via Docker na porta padrão)
docker run -d -p 27017:27017 mongo:7

# Rode os testes
npm test
```

**Resultado esperado:**

```
Test Suites: 5 passed, 5 total
Tests:       45 passed, 45 total
```

Os testes cobrem todos os endpoints com cenários de sucesso, erro de validação, acesso negado e recurso não encontrado.

---

## Documentação Swagger

Com a API rodando, acesse a documentação interativa:

```
http://localhost:3001/api-docs
```

Para testar rotas protegidas:
1. Faça `POST /auth/login` ou `POST /auth/register`
2. Copie o `token` retornado
3. Clique em **Authorize** (canto superior direito)
4. Cole `Bearer <seu_token>` e confirme

O spec OpenAPI em JSON está disponível em `http://localhost:3001/api-docs.json`.

---

## Endpoints da API

### Autenticação — `/auth` (público)

| Método | Rota | Descrição |
|---|---|---|
| POST | `/auth/register` | Registra novo usuário e retorna JWT |
| POST | `/auth/login` | Autentica e retorna JWT |
| GET | `/auth/me` | Retorna dados do usuário autenticado 🔒 |

### Usuários — `/users` (requer JWT)

| Método | Rota | Descrição | Perfil |
|---|---|---|---|
| GET | `/users` | Lista todos os usuários | admin |
| GET | `/users/:id` | Busca usuário por ID | qualquer |
| PUT | `/users/:id` | Atualiza dados do usuário | próprio / admin |
| DELETE | `/users/:id` | Remove usuário | admin |

### Carros — `/carros` (requer JWT)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/carros` | Lista carros (paginado) |
| GET | `/carros/:id` | Busca carro por ID |
| POST | `/carros` | Cadastra novo carro |
| PUT | `/carros/:id` | Atualiza carro |
| DELETE | `/carros/:id` | Remove carro |

### Motos — `/motos` (requer JWT)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/motos` | Lista motos (paginado) |
| GET | `/motos/:id` | Busca moto por ID |
| POST | `/motos` | Cadastra nova moto |
| PUT | `/motos/:id` | Atualiza moto |
| DELETE | `/motos/:id` | Remove moto |

### Marcas de Roupa — `/marcas-roupa` (requer JWT)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/marcas-roupa` | Lista marcas (paginado) |
| GET | `/marcas-roupa/:id` | Busca marca por ID |
| POST | `/marcas-roupa` | Cadastra nova marca |
| PUT | `/marcas-roupa/:id` | Atualiza marca |
| DELETE | `/marcas-roupa/:id` | Remove marca |

---

## Segurança OWASP

Controles implementados com base no **OWASP Top 10**:

| Risco | Controle |
|---|---|
| A01 — Broken Access Control | JWT obrigatório em todas as rotas protegidas; middleware `authorize(role)` restringe ações por perfil |
| A02 — Cryptographic Failures | Senhas armazenadas com `bcryptjs` (12 rounds de salt); token JWT assinado com chave secreta |
| A03 — Injection | `express-mongo-sanitize` bloqueia NoSQL Injection; Sequelize usa queries parametrizadas (SQL Injection) |
| A04 — Insecure Design | Rate limiting: 200 req/15min geral e 20 req/15min na rota de login |
| A05 — Security Misconfiguration | `helmet` configura headers HTTP seguros; CORS restrito por variável de ambiente |
| A07 — Auth Failures | Token com expiração configurável; validação em cada requisição protegida |
| A08 — Integrity Failures | Body limitado a 10kb; todos os campos validados por schema Joi antes de chegar ao banco |
