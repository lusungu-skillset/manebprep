# MANEB Prep API

Lightweight NestJS REST API for the MANEB Prep PWA, designed for low-bandwidth and offline-first study flows for Form 2 and Form 4 students in Malawi.

## Stack

- NestJS
- TypeORM
- Supabase PostgreSQL
- TypeScript

## Features

- Feature-based modules for subjects, topics, questions, and progress
- `GET /api/health` readiness endpoint for frontend and deployment checks
- Supabase-ready PostgreSQL connection through `DATABASE_URL`
- Offline-first sync metadata with `syncedAt` and `lastUpdatedAt`
- Bulk question download endpoint for subject-level caching
- Compression, CORS, validation, and standardized error responses
- Seed script with 24 sample questions across multiple subjects and topics

## Project Structure

```text
src/
  app.module.ts
  main.ts
  common/
  database/
  subjects/
  topics/
  questions/
  progress/
```

## Environment

Create a `.env` file from `.env.example`.

```env
PORT=5000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
DB_SSL=true
```

`DB_SSL=true` is recommended for Supabase. In local development with a non-SSL Postgres instance, set `DB_SSL=false`.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure your `.env` with the frontend origin and, when you want the data modules enabled, the Supabase Postgres connection string.

3. Seed the database:

```bash
npm run seed
```

4. Start the API in development:

```bash
npm run dev
```

5. Build for production:

```bash
npm run build
npm run start
```

## API Endpoints

- `GET /api/health`
- `GET /subjects`
- `GET /subjects?form=4`
- `GET /topics?subjectId=1`
- `GET /questions?topicId=3`
- `GET /questions?subject=math&form=4`
- `GET /questions/download?subject=math&form=4`
- `POST /progress`
- `GET /progress?userId=device-123`

Optional sync filter:

- `updatedAfter=2026-04-27T00:00:00.000Z`

## Sample Requests

Create progress:

```json
POST /progress
{
  "userId": "device-123",
  "questionId": 4,
  "selectedAnswer": "6"
}
```

Example standardized error response:

```json
{
  "statusCode": 404,
  "message": "Question not found.",
  "timestamp": "2026-04-27T03:30:00.000Z"
}
```

## Notes

- `synchronize` is enabled only when `NODE_ENV` is not `production`.
- When `DATABASE_URL` is not set, the backend still boots for local connectivity checks, but only non-database routes such as `GET /api/health` are enabled.
- The current seed script populates Form 2 and Form 4 content for frontend testing.
- Progress correctness is calculated on the server to keep results trustworthy.
- The download endpoint groups questions by topic so the PWA can cache a subject bundle efficiently.
