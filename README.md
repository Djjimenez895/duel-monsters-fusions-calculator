# Duel Monsters Fusion Calculator
A simple web app for looking up monster fusions from the Game Boy Duel Monsters game.

The live application can be found here: https://ygofusion.com/

## Table of Contents
- [Purpose](#purpose)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Local Development](#local-development)
- [Running Tests](#running-tests)
- [Planned Features](#planned-features)

## Purpose

Lookup Duel Monsters fusions faster. Before a tool like this, people would need to search on the game's wiki pages and find the cards they're using, and any fusion combos associated with them.

The main goal is to answer questions like:
"What can this monster fuse with?" or "What fusions can I make using this monster?"

## Features
- Search for a monster by name
- View all known fusion combinations involving that monster
- Display fusion results in a clean table with card images

## Tech Stack
- React
- TypeScript
- Vite
- HTML/CSS
- Node.js + Express (backend)
- PostgreSQL + Prisma
- Winston (logging)
- Vitest + Supertest (testing)

## Local Development

### Prerequisites
- Node.js 20+
- A PostgreSQL database (local install or [Supabase](https://supabase.com) free tier)

### Backend setup

1. Install dependencies:
    ```
    cd backend
    npm install
    ```

2. Create a `.env` file in `backend/`:
    ```
    DATABASE_URL=your_postgres_connection_string
    ALLOWED_ORIGINS=http://localhost:5173
    NODE_ENV=development
    ```

3. Generate the Prisma client:
    ```
    npx prisma generate
    ```

4. Seed the database by running `backend/db_seed_data/card_data.sql` against your PostgreSQL database using pgAdmin or `psql`.

5. Start the dev server:
    ```
    npm run dev
    ```
    The API will be available at `http://localhost:3000`.

### Frontend setup

1. Install dependencies:
    ```
    cd frontend
    npm install
    ```

2. Create a `.env` file in `frontend/`:
    ```
    VITE_API_URL=http://localhost:3000
    ```

3. Start the dev server:
    ```
    npm run dev
    ```
    The app will be available at `http://localhost:5173`.

## Running Tests

### Backend
Backend tests are integration tests that run against a real PostgreSQL database.

Before running tests, make sure you have:
1. A local PostgreSQL database with a `cards` schema
2. The seed data applied from `backend/db_seed_data/card_data.sql`
3. A `.env` file in `backend/` with a valid `DATABASE_URL`

Then run:
```
cd backend
npm test
```

### Frontend
Frontend tests are unit tests that run with jsdom — no database or server required.

```
cd frontend
npm test
```

## Planned Features
- Search by resulting fusion monster
- Filter by monster type
- Filter by attack/defense range
- Add autocomplete for monster names
- Add support for multiple Game Boy Duel Monsters games