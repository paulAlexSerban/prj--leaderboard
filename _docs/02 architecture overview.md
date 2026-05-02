# Leaderboard: Architecture Overview

**System Characteristics**
- High Read-to-Write Ratio: The leaderboard will be read frequently, but updates to user scores will be less frequent.
- Scalability: The system must handle a large number of concurrent users and requests without degradation in performance.
- Data Consistency: The leaderboard must reflect accurate rankings based on user scores, even under high load.

## Runtime Architecture
1. Web Layer (Express + Handlebars)
   - SSR routes render leaderboard, users, profile, and business pages.
   - API routes expose JSON payloads for leaderboard and user lifecycle operations.
2. Domain Layer (Controllers)
   - Controllers orchestrate query and mutation flows.
   - Input validation is handled at controller/storage boundaries.
3. Data Layer (JSON file storage)
   - Player and announcement data is persisted in `data/players.json`.
   - Read/write access uses Node `fs` APIs with in-memory cache initialization.

## Requirements
1. **Functional Requirements**
   - The system must handle the leaderboard page.
   - The system must provide API endpoints for fetching leaderboard and user data in JSON format.
   - The system must provide API endpoints for creating, updating, and deleting user data.
   - The system must handle user profile pages with detailed information.
   - The system must provide a not-found page for invalid user requests.
   - The system must handle buisiness website pages.
   - The system must be containerized for easy deployment.

2. **Non-Functional Requirements**
   - The system must be highly performant, with low latency for page rendering and API responses.
   - The system must be scalable to an increasing number of users.
   - The system must be reliable, with minimal downtime and robust error handling.
   - The system must be testable, with unit, integration, and end-to-end tests to ensure functionality and performance.
   - The system must be compatible with modern web browsers and devices.

## Implementation Plan
1. Align documented and implemented routes
   - Ensure `/` renders leaderboard and all API endpoints are wired.
2. Expand data model for business context
   - Keep player records complete and add announcement content.
3. Harden backend behavior
   - Validate IDs and payloads.
   - Return consistent `400` / `404` error semantics for API requests.
4. Build complete website UI
   - Create responsive, business-friendly pages for leaderboard, users, profile, not-found, and about.
5. Keep architecture observable
   - Expose leaderboard freshness via API timestamp.

## Delivered Features
1. Full endpoint coverage for leaderboard and user CRUD APIs.
2. Root page routing (`/`) for leaderboard SSR.
3. Search/sort support for users list in website and API (`q`, `sort`).
4. Business snapshot aggregation (total users, average score, top score, top players, announcements).
5. New business overview webpage (`/about`).

## Tech Stack
- Node.js 24
- JavaScript + Express.js
- JSON file storage via built-in `fs` module
- Handlebars (`express-handlebars`) for SSR templates
- Yarn for dependency management
- Docker + Docker Compose for containerization
