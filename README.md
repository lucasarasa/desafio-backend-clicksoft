# 🎯 API de Gestão de Eventos

> API REST para gerenciamento de eventos com sistema de inscrições, autenticação JWT e validações completas de regras de negócio.

[![AdonisJS](https://img.shields.io/badge/AdonisJS-v6-blueviolet)](https://adonisjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)

---

## 📋 Sobre o Projeto

Sistema completo de gestão de eventos desenvolvido seguindo os princípios de **Clean Architecture**, permitindo que organizadores criem e gerenciem eventos enquanto participantes podem se inscrever, visualizar e cancelar suas participações.

### ✨ Principais Funcionalidades

- 🔐 **Autenticação JWT** - Sistema seguro de login para Organizadores e Participantes
- 👥 **Gestão de Participantes** - Cadastro, edição de dados e gerenciamento de inscrições
- 📅 **Gestão de Eventos** - Criação, edição e exclusão de eventos (apenas pelo criador)
- ✅ **Validações de Negócio** - Capacidade máxima, conflito de horários, unicidade de inscrições
- 🏗️ **Clean Architecture** - Separação clara entre camadas (Controllers, Use Cases, Repositories)

---

## 🛠️ Tecnologias Utilizadas

- **[AdonisJS v6](https://adonisjs.com/)** - Framework Node.js moderno e robusto
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional
- **[Lucid ORM](https://lucid.adonisjs.com/)** - ORM oficial do AdonisJS
- **[JWT](https://jwt.io/)** - Autenticação baseada em tokens
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática e segurança

---

## 🏗️ Arquitetura do Projeto

```
app/
├── controllers/       # Recebem requisições HTTP e chamam Use Cases
├── use_cases/        # Implementam regras de negócio
├── repositories/     # Acesso e manipulação do banco de dados
├── models/           # Modelos do Lucid ORM com relacionamentos
├── dtos/             # Objetos de transferência de dados
├── validators/       # Validações de entrada
├── middleware/       # Autenticação e outras interceptações
└── utils/            # Utilitários e enums
```

---

## 📦 Requisitos Funcionais

### Módulo de Autenticação

- [x] **RF01**: Login de Organizadores e Participantes via Token

### Módulo Participante

- [x] **RF02**: Cadastro de novo participante (Nome, E-mail, CPF)
- [x] **RF03**: Edição de dados pessoais
- [x] **RF04**: Visualização de eventos inscritos
- [x] **RF05**: Cancelamento de inscrição

### Módulo Organizador

- [x] **RF06**: Cadastro de novo organizador
- [x] **RF07**: Criação de eventos
- [x] **RF08**: Edição de eventos próprios
- [x] **RF09**: Exclusão de eventos (sem participantes)
- [x] **RF10**: Visualização de participantes do evento

---

## 🎯 Regras de Negócio

- [x] **RN01**: Capacidade máxima respeitada - novas inscrições bloqueadas quando lotado
- [x] **RN02**: Conflito de horário impedido - participante não pode ter dois eventos simultâneos
- [x] **RN03**: Unicidade de inscrição - participante não pode se inscrever duas vezes no mesmo evento
- [x] **RN04**: Ownership validado - organizador só edita/deleta seus próprios eventos
- [x] **RN05**: Campos obrigatórios - Nome, Data/Hora, Localização, Capacidade Máxima

---

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Node.js 20+
- PostgreSQL 14+
- npm ou yarn

### 1️⃣ Clone o repositório

```bash
git clone https://github.com/lucasarasa/desafio-backend-clicksoft.git
cd desafio-backend-clicksoft
```

### 2️⃣ Instale as dependências

```bash
npm install
```

### 3️⃣ Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais do PostgreSQL:

```env
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_DATABASE=gestao_eventos
```

### 4️⃣ Gere a APP_KEY

```bash
node ace generate:key
```

### 5️⃣ Execute as migrations

```bash
node ace migration:run
```

### 6️⃣ Inicie o servidor

```bash
npm run dev
```

A API estará disponível em `http://localhost:3333` 🎉

---

## 📡 Testando a API

### Opção 1: Postman Collection

Importe o arquivo `postman-collection.json` no Postman para ter acesso a todas as rotas configuradas com:

- ✅ Variáveis automáticas para tokens
- ✅ Scripts que salvam tokens após login
- ✅ Testes de regras de negócio prontos

### Opção 2: Exemplos de Requisições

#### Cadastro de Participante

```bash
POST /auth/signup
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@email.com",
  "cpf": "12345678901",
  "password": "senha123",
  "role": "participant"
}
```

#### Login

```bash
POST /auth/signin
Content-Type: application/json

{
  "email": "joao@email.com",
  "password": "senha123"
}
```

#### Criar Evento (como Organizador)

```bash
POST /organizers/events
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Workshop AdonisJS",
  "date_hour": "2024-12-15T14:00:00",
  "localization": "Centro de Convenções - Sala 203",
  "description": "Aprenda AdonisJS do zero ao avançado",
  "capacity_max": 50
}
```

#### Inscrever em Evento (como Participante)

```bash
POST /participants/me/events
Authorization: Bearer {token}
Content-Type: application/json

{
  "eventId": 1
}
```

---

## 🗂️ Estrutura do Banco de Dados

### Tabelas Principais

- **users** - Usuários do sistema (base para auth)
- **participants** - Dados específicos de participantes
- **organizers** - Dados específicos de organizadores
- **events** - Eventos criados pelos organizadores
- **event_participants** - Relacionamento N:N entre eventos e participantes

### Relacionamentos

```
users (1) ─── (0..1) participants
users (1) ─── (0..1) organizers
organizers (1) ─── (N) events
events (N) ─── (N) participants [event_participants]
```

---

## 📝 Endpoints da API

### 🔐 Autenticação

| Método | Endpoint       | Descrição           |
| ------ | -------------- | ------------------- |
| POST   | `/auth/signup` | Cadastro de usuário |
| POST   | `/auth/signin` | Login               |

### 👤 Participante

| Método | Endpoint                           | Descrição           |
| ------ | ---------------------------------- | ------------------- |
| PATCH  | `/participants/me`                 | Atualizar dados     |
| POST   | `/participants/me/events`          | Inscrever em evento |
| GET    | `/participants/me/events`          | Listar meus eventos |
| DELETE | `/participants/me/events/:eventId` | Cancelar inscrição  |

### 🎫 Organizador

| Método | Endpoint                              | Descrição            |
| ------ | ------------------------------------- | -------------------- |
| POST   | `/organizers/events`                  | Criar evento         |
| PATCH  | `/organizers/events/:id`              | Atualizar evento     |
| DELETE | `/organizers/events/:id`              | Deletar evento       |
| GET    | `/organizers/events/:id/participants` | Listar participantes |

---

## ✅ Checklist de Desenvolvimento

### Estrutura e Arquitetura

- [x] Controllers (apenas recebem requisição e chamam UseCase)
- [x] Validators (validações de entrada)
- [x] DTOs para tráfego de dados entre camadas
- [x] Use Cases para Regras de Negócio
- [x] Repositories para interação com banco (Lucid ORM)
- [x] Clean Architecture / Camadas desacopladas

### Funcionalidades

- [x] Sistema de autenticação completo
- [x] Módulo Participante (RF02-RF05)
- [x] Módulo Organizador (RF06-RF10)
- [x] Todas as Regras de Negócio (RN01-RN05)

### Banco de Dados

- [x] Modelagem completa
- [x] Migrations em ordem correta
- [x] Relacionamentos Lucid configurados
- [x] Foreign Keys criadas

### Qualidade

- [x] Tratamento de erros com status HTTP corretos
- [x] Mensagens em PT-BR
- [x] Validações em todas as camadas
- [x] Código limpo e organizado

### Entrega

- [x] Repositório GitHub público
- [x] Collection Postman completa
- [x] Arquivo .env.example
- [x] README documentado

---

## 👨‍💻 Autor

Desenvolvido por **Lucas Sarasa** como parte do desafio técnico Backend da Clicksoft.

---

## 📄 Licença

Este projeto foi desenvolvido para fins de avaliação técnica.

---

**🚀 Desenvolvido com AdonisJS, PostgreSQL e Clean Architecture**
