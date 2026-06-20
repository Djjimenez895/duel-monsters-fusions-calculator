# Duel Monsters Fusion Calculator
A simple web app for looking up monster fusions from the Game Boy Duel Monsters game.

A player can enter the name of a monster, and the app returns a table showing:

- Monsters it can fuse with
- The resulting fusion monster
- Fusion combinations in an easy-to-search format

For example:

| Monster A | Monster B | Result |
|----------|-----------|--------|
| Monster A | Monster B | Monster C |

## Purpose

Lookup Duel Monsters fusions faster. Before a tool like this, people would need to search on the game's wiki pages and find the cards they're using, and any fusion combos assocaited with them. 

The main goal is to answer questions like:
“What can this monster fuse with?” or “What fusions can I make using this monster?”

## Features (WIP)
- Search for a monster by name
- View all known fusion combinations involving that monster
- Display fusion results in a clean table

## Tech Stack
- React
- TypeScript
- Vite
- HTML/CSS
- Node.js + Express (backend)
- PostgreSQL + Prisma
- Winston (logging)
- Vitest + Supertest (testing)

## Running Tests

Backend tests are integration tests that run against a real PostgreSQL database.

Before running tests, make sure you have:
1. A local PostgreSQL database named `duel_monsters` with a `cards` schema
2. The seed data applied from `backend/prisma/initial_seed_data.sql`
3. A `.env` file in `backend/` with a valid `DATABASE_URL`

Then run:
```
cd backend
npm test
```

## Planned Features
- Search by resulting fusion monster
- Filter by monster type
- Filter by attack/defense range
- Show card details for each monster
- Add support for multiple Game Boy Duel Monsters games
- Improve mobile layout
- Add autocomplete for monster names
- Add tests for fusion lookup logic
