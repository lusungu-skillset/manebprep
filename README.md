# MANEB Prep Backend

> A production-oriented REST API powering **MANEB Prep**, a learning platform designed to help students prepare for Malawi's national examinations through structured questions, past papers, subject content, and progress tracking.

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat\&logo=nestjs\&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat\&logo=typescript\&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat\&logo=postgresql\&logoColor=white)](https://www.postgresql.org/)
[![TypeORM](https://img.shields.io/badge/TypeORM-FE0803?style=flat\&logo=typeorm\&logoColor=white)](https://typeorm.io/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat\&logo=docker\&logoColor=white)](https://www.docker.com/)
[![Jest](https://img.shields.io/badge/Tests-Jest-C21325?style=flat\&logo=jest\&logoColor=white)](https://jestjs.io/)

---

## 🚀 Overview

**MANEB Prep Backend** is the backend service for an educational platform that enables learners to:

* Browse subjects and topics
* Practice examination questions
* Search and download question sets
* Access past examination papers
* Track learning progress
* Synchronize offline attempts
* Manage educational content through protected administrative endpoints

The API is built with **NestJS and TypeScript**, uses **PostgreSQL** for persistence, and **TypeORM** for database access and migrations.

The project focuses on building a maintainable backend with clear module separation, validated API inputs, database migrations, Docker support, and APIs designed to support both online and offline learning workflows.

---

## 🧠 Engineering Highlights

This project demonstrates practical backend engineering skills including:

* **REST API development** with NestJS
* **Type-safe development** with TypeScript
* **Relational database design** using PostgreSQL
* **ORM-based persistence** with TypeORM
* **Database migrations** instead of automatic schema synchronization
* **Input validation** and rejection of unknown request fields
* **API protection** using admin API-key authentication
* **Offline-first synchronization** for learner attempts
* **Incremental content synchronization** using timestamps
* **Bulk data operations** for educational content
* **Dockerized deployment** with Docker Compose
* **Automated testing** with Jest
* **Health monitoring** through a dedicated health endpoint
* **Environment-based configuration** for local and deployed environments

---

## 🏗️ Architecture

```text
                         ┌─────────────────────┐
                         │   MANEB Prep Web    │
                         │     Frontend        │
                         └──────────┬──────────┘
                                    │
                                    │ REST / HTTP
                                    ▼
                         ┌─────────────────────┐
                         │   NestJS Backend    │
                         │                     │
                         │  ┌───────────────┐  │
                         │  │ Subjects      │  │
                         │  │ Topics        │  │
                         │  │ Questions     │  │
                         │  │ Past Papers   │  │
                         │  │ Progress      │  │
                         │  │ Health        │  │
                         │  └───────────────┘  │
                         └──────────┬──────────┘
                                    │
                                    │ TypeORM
                                    ▼
                         ┌─────────────────────┐
                         │     PostgreSQL      │
                         │                     │
                         │  Educational Data   │
                         │  Questions          │
                         │  Past Papers        │
                         │  Learner Progress   │
                         └─────────────────────┘
```

---

## ✨ Core Features

### 📚 Subjects & Topics

Provides APIs for organizing educational content into subjects and topics.

* Subject listing
* Topic listing
* Filtering by form and subject
* Incremental synchronization using `updatedAfter`

### ❓ Questions

Supports examination-question workflows including:

* Search
* Topic-based question retrieval
* Subject-based filtering
* Form filtering
* Bulk question creation
* Question downloads grouped by topic
* Content update tracking

### 📄 Past Papers

Learners can access past examination papers with filtering by:

* Form
* Year
* Season

Individual past papers can also be retrieved by ID.

### 📈 Learner Progress

The backend supports progress tracking and offline learning workflows.

Learners can:

* Save answers
* Retrieve saved progress
* Synchronize offline attempts
* Submit up to 500 attempts per synchronization request
* Avoid duplicate attempts through duplicate-ID handling

Correctness is calculated server-side rather than being trusted from the client.

### 🔐 Content Management

Administrative endpoints are protected using an API key.

Protected operations include:

* Creating subjects
* Updating subjects
* Deleting subjects
* Creating topics
* Updating topics
* Deleting topics
* Creating questions
* Updating questions
* Deleting questions
* Bulk question creation
* Managing past papers

### ❤️ Health Monitoring

A dedicated health endpoint is available:

```http
GET /api/health
```

This is also used by Docker Compose for service health checking.

---

## 🛠️ Technology Stack

| Technology         | Purpose                           |
| ------------------ | --------------------------------- |
| **NestJS**         | Backend framework                 |
| **TypeScript**     | Type-safe application development |
| **PostgreSQL**     | Relational database               |
| **TypeORM**        | Database access and migrations    |
| **Docker**         | Containerization                  |
| **Docker Compose** | Local service orchestration       |
| **Jest**           | Automated testing                 |
| **npm**            | Dependency and script management  |

---

## 📁 Project Structure

The repository contains two separately runnable applications:

```text
manebprep/
│
├── Backend/
│   ├── src/
│   │   ├── common/
│   │   ├── database/
│   │   ├── health/
│   │   ├── past-papers/
│   │   ├── progress/
│   │   ├── questions/
│   │   ├── subjects/
│   │   └── topics/
│   │
│   ├── package.json
│   └── ...
│
├── maneprep_frontend/
│   └── Frontend/
│       └── Next.js application
│
├── docker-compose.yml
└── .env.docker
```

### Backend module responsibilities

```text
src/
├── common/        Guards, exception handling & sync utilities
├── database/      TypeORM configuration & migrations
├── health/        Health monitoring
├── past-papers/   Past-paper API & persistence
├── progress/      Learner history & offline synchronization
├── questions/     Question API, validation & downloads
├── subjects/      Subject management
└── topics/        Topic management
```

---

## ⚙️ Requirements

Before running the backend locally, install:

* **Node.js 20+**
* **npm**
* **PostgreSQL**

You will also need a PostgreSQL connection string.

> **Database note:** migrations are explicit and `synchronize` is disabled. The included migration adds practice-content support but does not populate educational content.

---

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd manebprep/Backend
```

### 2. Install dependencies

```bash
npm ci
```

### 3. Configure environment variables

Create a `.env` file inside `Backend/`:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE
ADMIN_API_KEY=replace-with-a-long-random-secret
FRONTEND_URL=http://localhost:3000
```

### Environment variables

| Variable        | Description                            |
| --------------- | -------------------------------------- |
| `PORT`          | Port used by the API                   |
| `NODE_ENV`      | Application environment                |
| `DATABASE_URL`  | PostgreSQL connection string           |
| `ADMIN_API_KEY` | Secret used to protect admin endpoints |
| `FRONTEND_URL`  | Allowed frontend origin for CORS       |

### 4. Start the API

```bash
npm run dev
```

The backend will be available at:

```text
http://localhost:5000
```

### 5. Verify the API

```bash
curl http://localhost:5000/api/health
```

---

## 🌐 Frontend Configuration

The frontend is a separate Next.js application.

From:

```text
manebprep/maneprep_frontend/Frontend
```

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Then:

```bash
npm ci
npm run dev
```

The frontend will be available at:

```text
http://localhost:3000
```

---

## 🐳 Docker

The project includes Docker Compose configuration for running the backend in a containerized environment.

### Configure environment

Create:

```text
manebprep/.env.docker
```

and provide:

```env
DATABASE_URL=your-postgresql-connection-string
ADMIN_API_KEY=your-secure-admin-key
```

### Start the backend

From the project root:

```bash
docker compose up --build -d
```

The API will be available at:

```text
http://localhost:5000
```

Docker Compose also checks the application's health endpoint.

### Stop the application

```bash
docker compose down
```

---

## 🗄️ Database Migrations

Run migrations from the `Backend` directory.

### Apply migrations

```bash
npm run migration:run
```

### Revert the latest migration

```bash
npm run migration:revert
```

> Review migrations before applying them to shared or production databases.

---

## 🔌 API Reference

### Public endpoints

| Method | Endpoint                           | Description                         |
| ------ | ---------------------------------- | ----------------------------------- |
| `GET`  | `/api/health`                      | API health status                   |
| `GET`  | `/subjects`                        | List subjects                       |
| `GET`  | `/topics`                          | List topics                         |
| `GET`  | `/topics/:topicId/questions`       | Questions for a topic               |
| `GET`  | `/questions`                       | Search/filter questions             |
| `GET`  | `/questions/download`              | Download questions grouped by topic |
| `GET`  | `/content/version`                 | Latest question update timestamp    |
| `GET`  | `/past-papers`                     | List past papers                    |
| `GET`  | `/past-papers/years/:form`         | Available years                     |
| `GET`  | `/past-papers/seasons/:form/:year` | Available seasons                   |
| `GET`  | `/past-papers/:id`                 | Retrieve a past paper               |
| `GET`  | `/progress`                        | Retrieve learner progress           |
| `POST` | `/progress`                        | Save an answer                      |
| `POST` | `/progress/sync`                   | Synchronize offline attempts        |

### Admin endpoints

The following operations require an `x-admin-key` header:

```text
Subjects
├── POST
├── PATCH
└── DELETE

Topics
├── POST
├── PATCH
└── DELETE

Questions
├── POST
├── PATCH
├── DELETE
└── POST /questions/bulk

Past Papers
├── POST
├── PATCH
└── DELETE
```

---

## 🔐 API Security

Admin-protected endpoints require:

```http
x-admin-key: YOUR_ADMIN_API_KEY
```

The backend also:

* Validates incoming request bodies
* Rejects unknown fields
* Keeps administrative credentials in environment variables
* Separates development configuration from production credentials

**Never commit `.env` files or production secrets to version control.**

---

## 🔄 Incremental Synchronization

The API supports incremental content synchronization using timestamps.

For example:

```http
GET /subjects?updatedAfter=2026-01-01T00:00:00Z
```

Supported synchronization features include:

* `updatedAfter` filtering
* `syncedAt` metadata
* `lastUpdatedAt` metadata
* Offline attempt synchronization
* Duplicate attempt handling

This allows clients to synchronize only the content that has changed instead of repeatedly downloading the entire dataset.

---

## 🧪 Testing

Run the test suite with:

```bash
npm test
```

Build the production application with:

```bash
npm run build
```

Start the compiled application with:

```bash
npm start
```

---

## 📜 Available Scripts

| Command                    | Purpose                          |
| -------------------------- | -------------------------------- |
| `npm run dev`              | Development/watch mode           |
| `npm run build`            | Compile TypeScript               |
| `npm start`                | Start compiled application       |
| `npm run migration:run`    | Apply database migrations        |
| `npm run migration:revert` | Revert latest migration          |
| `npm run audit:questions`  | Generate question validation CSV |
| `npm test`                 | Run Jest tests                   |

---

## 🎯 Project Goals

MANEB Prep is designed around a simple goal:

> **Make examination preparation more accessible by providing structured educational content and supporting learning both online and offline.**

From an engineering perspective, the project is also an opportunity to apply real-world backend practices including modular architecture, database migrations, API security, containerization, testing, and synchronization strategies.

---

## 👨‍💻 Developer

**Lusungu Mhango**

Computer Science graduate | Backend & DevOps enthusiast

* GitHub: [github.com/lusungu-skillset](https://github.com/lusungu-skillset)
* Portfolio: [lusungu-mhango.vercel.app](https://lusungu-mhango.vercel.app)

---

## 📌 Project Status

**Active development**

The backend is functional and provides the core APIs required by the MANEB Prep platform. Further development may include additional authentication, expanded content-management capabilities, deployment automation, and production infrastructure.

-
