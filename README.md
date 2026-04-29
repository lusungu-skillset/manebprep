# MANEB Prep Monorepo

This repository contains two independent services:

- `Backend`: a NestJS API served locally on `http://localhost:5000`
- `Frontend`: a Next.js App Router app served locally on `http://localhost:3000`

The frontend talks to the backend through `NEXT_PUBLIC_API_URL`, and the backend accepts the frontend origin through `FRONTEND_URL`.

## 🚀 Quick Start with Docker (Recommended)

For end-to-end PWA testing, use Docker Compose for the backend and run frontend locally:

**Linux/macOS:**
```bash
chmod +x docker-start.sh
./docker-start.sh
```

**Windows:**
```bash
docker-start.bat
```

Then in a separate terminal, start the frontend:
```bash
cd Frontend
pnpm install
pnpm dev
```

This automatically:
- ✅ Builds Backend container
- ✅ Starts PostgreSQL database
- ✅ Runs backend with proper networking
- ✅ Prints instructions for starting frontend locally

Then open: http://localhost:3000

For detailed Docker documentation, see [DOCKER_SETUP.md](./DOCKER_SETUP.md)

## Documentation

- **[Docker Setup](./DOCKER_SETUP.md)** - Run with Docker for end-to-end PWA testing
- **[Admin Guide](./ADMIN_GUIDE.md)** - How to manage content by form/class, create subjects, topics, and questions
- **[Implementation Verification](./IMPLEMENTATION_VERIFICATION.md)** - Technical details on form-based hierarchy validation and security

## Folder Structure

```text
ManebPrep/
  Backend/
  Frontend/
```

## Setup

1. Install backend dependencies:

```bash
cd Backend
npm install
```

2. Install frontend dependencies:

```bash
cd Frontend
pnpm install
```

3. Backend local environment:

Create `Backend/.env` from `Backend/.env.example`.

```env
PORT=5000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
DB_SSL=true
ADMIN_API_KEY=maneb-admin  # Change this to a secure value in production
```

`DATABASE_URL` is required for the database-backed API modules. If it is omitted during local wiring work, the backend still starts and serves `GET /api/health`.

**Admin Key:** The `ADMIN_API_KEY` protects content creation/update/delete endpoints. Use the same key in the admin dashboard to manage subjects, topics, and questions. See [Admin Guide](./ADMIN_GUIDE.md) for details.

The current seed data covers `Form 2` and `Form 4`, which are the forms the frontend now exposes for live backend testing.

4. Frontend local environment:

Create `Frontend/.env.local`.

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Run Locally

1. Start the backend:

```bash
cd Backend
npm run dev
```

2. Start the frontend:

```bash
cd Frontend
pnpm dev
```

3. Open `http://localhost:3000/test`.

The test page calls `${NEXT_PUBLIC_API_URL}/api/health` and should display a JSON response like:

```json
{
  "status": "ok",
  "timestamp": "2026-04-27T04:00:00.000Z"
}
```

## Environment Variables

Backend:

- `PORT`: API port for local or deployed runtime
- `FRONTEND_URL`: allowed CORS origin for the frontend
- `NODE_ENV`: environment mode
- `DATABASE_URL`: PostgreSQL connection string for database-backed routes
- `DB_SSL`: database SSL toggle

Frontend:

- `NEXT_PUBLIC_API_URL`: public base URL used by the browser to call the backend

## Notes

- The services stay independent and do not proxy through Next.js.
- Runtime URLs are environment-driven rather than hardcoded in frontend API calls.
- `GET /api/health` is the quickest local connectivity check before enabling the full database-backed workflow.
- The main MANEB study flows now depend on the database-backed `/subjects`, `/questions/download`, and `/progress` endpoints.
# manebprep
