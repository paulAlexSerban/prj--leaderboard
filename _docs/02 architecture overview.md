# Leaderboard: Architecture Overview

**System Characteristics**
- High Read-to-Write Ratio: The leaderboard will be read frequently, but updates to user scores will be less frequent.
- Scalability: The system must handle a large number of concurrent users and requests without degradation in performance.
- Data Consistency: The leaderboard must reflect accurate rankings based on per-game scores and overall totals.

## Runtime Architecture
1. Web Layer (Express + Handlebars)
   - SSR routes render home, leaderboard, games, users, profile, and business pages.
   - API routes expose JSON payloads for leaderboard, games, and user lifecycle operations.
2. Domain Layer (Controllers)
   - Controllers orchestrate query and mutation flows.
   - Input validation is handled at controller/storage boundaries.
3. Data Layer (JSON file storage)
   - Game catalog, players, per-game scores, and announcements are persisted in `data/players.json`.
   - Read/write access uses Node `fs` APIs with in-memory cache initialization.
   - `data/site.json` stores markdown navigation and routable content metadata.

## Requirements
1. **Functional Requirements**
   - The system must handle home and leaderboard pages.
   - The system must provide per-game and overall leaderboard views.
   - The system must provide API endpoints for fetching leaderboard, games, and user data in JSON format.
   - The system must provide API endpoints for creating, updating, and deleting user data.
   - The system must handle user profile pages with detailed information.
   - The system must show per-game score breakdowns for individual users.
   - The system must provide a not-found page for invalid user requests.
   - The system must handle business website pages.
   - The system must be containerized for easy deployment.

2. **Non-Functional Requirements**
   - The system must be highly performant, with low latency for page rendering and API responses.
   - The system must be scalable to an increasing number of users.
   - The system must be reliable, with minimal downtime and robust error handling.
   - The system must be testable, with unit, integration, and end-to-end tests to ensure functionality and performance.
   - The system must be compatible with modern web browsers and devices.

## Implementation Plan
1. Align documented and implemented routes
   - Ensure home, leaderboard, games, users, and API endpoints are wired.
2. Expand data model for multi-game context
   - Keep player records complete and store scores as `scores[gameId]`.
   - Maintain a canonical game catalog and announcement feed.
3. Harden backend behavior
   - Validate IDs, game filters, and payloads.
   - Return consistent `400` / `404` error semantics for API requests.
4. Build complete website UI
   - Create responsive pages for home, leaderboard, games, users, profile, markdown pages, and not-found.
5. Keep architecture observable
   - Expose leaderboard freshness via API timestamp and game-scoped responses.

## Delivered Features
1. Multi-game data model with `games[]`, `users[]`, and per-game `scores` objects.
2. Overall and per-game leaderboard retrieval (`/leaderboard` and `/api/leaderboard?game=<id>`).
3. Games catalogue routes (`/games` and `/api/games`).
4. Root/home parity (`/` and `/home`) with top overall rankings.
5. User profile pages with per-game score breakdown and leaderboard links.
6. Business snapshot aggregation (total users, total games, top score, top players, announcements).
7. Markdown-driven business pages (`/about`, `/service`, `/faq`, `/contact`).

## Tech Stack
- Node.js 24
- JavaScript + Express.js
- JSON file storage via built-in `fs` module
- Handlebars (`express-handlebars`) for SSR templates
- Yarn for dependency management
- Docker + Docker Compose for containerization
