# Leaderboard: Architecture Overview

**System Characteristics**
- High Read-to-Write Ratio: The leaderboard will be read frequently, but updates to user scores will be less frequent.
- Scalability: The system must handle a large number of concurrent users and requests without degradation in performance.
- Data Consistency: The leaderboard must reflect accurate rankings based on user scores, even under high load.

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

## Tech Stack
- Node.js 24
- JavaScript + Express.js
- JSON file storage via built-in `fs` module
- Handlebars (`express-handlebars`) for SSR templates
- Yarn for dependency management
- Docker + Docker Compose for containerization
