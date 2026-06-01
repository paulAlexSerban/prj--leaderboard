# PulseBoard - Leaderboard Service

> - **Document Status**: Draft
> - **Last Updated**: 2026 May 03
> - **Author**: Paul Serban

PulseBoard is a leaderboard website and API for multi-game competitive products.
The service combines two priorities:

1. High-quality player experience through fast per-game ranking pages.
2. Business visibility through platform metrics and operational pages.

## Overview

**Brief description**: PulseBoard is a multi-game ranking platform built for gaming organizations that need transparent, auditable, and real-time competitive standings across more than one title.

**Business Context**

- Company size: Small startup with a lean team.
- Current state: Early development with a focus on core features and architecture.
- Desired future state: A fully functional, scalable leaderboard platform with a growing user base and robust business operations.
- Industry: Online Gaming
- Goal: Support growth from early adopters to high-volume player traffic.
- Target Personas:
  - Players who want clear ranking and profile visibility.
  - Business operators who need reliable engagement and performance data.

## Requirements

### Functional Requirements (What the system should do)

- The system must
  - render home and leaderboard pages
  - render per-game and overall leaderboard views
  - provide API endpoints for fetching leaderboard, games, and user data in JSON format
  - provide API endpoints for creating, updating, and deleting user data
  - handle user profile pages with detailed information
  - show per-game score breakdowns for individual users
  - provide a not-found page for invalid user requests
  - handle business website pages
  - be containerized for easy deployment

### Non-Functional Requirements (What the system should deal with)

- The system must be
  - highly performant, with low latency for page rendering and API responses
  - scalable to an increasing number of users.
  - reliable, with minimal downtime and robust error handling.
  - testable, with unit, integration, and end-to-end tests to ensure functionality and performance.
  - compatible with modern web browsers and devices.

**Performance Requirements:**
  - 50 concurrent users
  - 1 second response time for 95th percentile
  - 1.5 seconds response time for 99th percentile
  - 100 req/s throughput

**Data Volume Estimation:**
  - 1000 users
  - 10 games
  - 10000 players
  - 100000 scores
  - 1000000 announcements

**Service Level Agreement (SLA):**
  - 99.9% availability

**Integration Requirements:**
  - The system must provide a RESTful API for integration with third-party services and internal tools.
  - **Online Gaming**: The system must integrate with popular gaming platforms to fetch player data and scores.

**Infrastructure Constraints:**
  - Local commercial hosting VPS with Node.js support.
  - Containerization using Docker for deployment.

# [Executive Summary](./executive_summary.md)

## Runtime Architecture

1. Web Layer (Express + Handlebars)
   - SSR routes render `/home`, `/leaderboard`, `/games`, `/users`, `/users:id`, and `/about`, `/service`, `/faq`, `/contact` pages.
   - API routes expose JSON payloads for `/api/leaderboard`, `/api/games`, `/api/users`, `/api/users/:id` endpoints.
2. Domain Layer (Controllers)
   - Controllers orchestrate query and mutation flows.
   - Input validation is handled at controller/storage boundaries.
3. Data Layer (JSON file storage)
   - Game catalog, players, per-game scores, and announcements are persisted in `data/players.json`.
   - Read/write access uses Node `fs` APIs with in-memory cache initialization.
   - `data/site.json` stores site configuration and navigation.
   - `data/*.md` stores markdown content for business website pages.

## Components

Based on [the requirements](#requirements), the following components comprise the system architecture:

1. **Web Layer (Express + Handlebars)**
   - SSR routes render `/home`, `/leaderboard`, `/games`, `/users`, `/users:id`, and `/about`, `/service`, `/faq`, `/contact` pages.
   - API routes expose JSON payloads for `/api/leaderboard`, `/api/games`, `/api/users`, `/api/users/:id` endpoints.
   - Responsibilities: Handle HTTP requests, render HTML pages, serve static assets, and provide API endpoints.
   - Boundaries: Does not contain business logic or data access code; delegates to the domain layer.

2. **Domain Layer (Controllers)**
   - Controllers orchestrate query and mutation flows.
   - Input validation is handled at controller/storage boundaries.
   - Responsibilities: Implement business logic, validate inputs, and coordinate data retrieval and manipulation.
   - Boundaries: Does not directly handle HTTP requests or data storage; interacts with the web layer and data layer.

3. **Data Layer (JSON file storage)**
   - Game catalog, players, per-game scores, and announcements are persisted in `data/players.json`.
   - Read/write access uses Node `fs` APIs with in-memory cache initialization.
   - Responsibilities: Manage data persistence, provide an interface for reading and writing data, and ensure data consistency.
   - Boundaries: Does not contain business logic or handle HTTP requests; interacts with the domain layer.
   - Note: This component is designed for simplicity and may need to be replaced with a more robust database solution as the system scales.

4. **API Layer**
   - Exposes RESTful endpoints for fetching leaderboard data, game information, and user management operations.
   - Responsibilities: Ensure that all API responses are consistent and follow the defined contracts, handle input validation for API requests, and return appropriate status codes for success and errors.
   - Boundaries: Does not contain business logic or data storage code; interacts with the web layer and domain layer.

5. **Business Website Pages**
   - Provides static content about the business, its services, and contact information.
   - Responsibilities: Enhance visibility and credibility with users by sharing information about the business, its mission, team members, services offered, and contact details.
   - Boundaries: Does not contain business logic or data storage code; rendered using server-side templates and may include static content.

## Services Drill Down

This section provides detailed architecture and design specifications for each service component in the system.

### Web Service (Express + Handlebars)

**Purpose**: Serve web pages and API endpoints for the leaderboard application.
**Architecture Decision Process:**

1. **Applicartion Type**
   - What it does: Handles HTTP requests, renders HTML pages, and serves JSON APIs.
   - Type decription: Web Application

2. **Technology Stack**
   - Node.js 24
   - Express.js for web server and routing
   - Handlebars for server-side rendering
   - Markdown files for business website pages
   - Docker for containerization

3. **Architecture Design**
   - Pattern: Layered architecture with separation of concerns between web layer, domain layer, and data layer.
   - Layers/Components:
     - Web Layer: Handles HTTP requests, renders and serves HTMLpages, and serves JSON APIs.
     - Domain Layer: Contains business logic and controllers.
     - Data Layer: Manages data persistence using JSON file storage.

4. **API Design**

## Endpoints

<!-- @TODO: Maintain parity between documented and implemented routes. Consider using Swagger/OpenAPI for interactive documentation and testing. -->

| Functionality     | HTTP Method | Endpoint           | Return Codes                           | Description                                               |
| ----------------- | ----------- | ------------------ | -------------------------------------- | --------------------------------------------------------- |
| Home Page         | GET         | `/`                | 200 OK                                 | Renders home content and top overall players.             |
| Home Alias        | GET         | `/home`            | 200 OK                                 | Renders the same content as `/`.                          |
| Leaderboard Page  | GET         | `/leaderboard`     | 200 OK                                 | Renders overall leaderboard or game-filtered leaderboard. |
| Games Page        | GET         | `/games`           | 200 OK                                 | Renders game catalog and game navigation links.           |
| Users Page        | GET         | `/users`           | 200 OK                                 | Renders the users page with the list of users.            |
| User Profile Page | GET         | `/users/:id`       | 200 OK, 404 Not Found                  | Renders the user profile with per-game scores.            |
| Get Leaderboard   | GET         | `/api/leaderboard` | 200 OK, 400 Bad Request                | Fetches overall or per-game leaderboard JSON payload.     |
| Get Games         | GET         | `/api/games`       | 200 OK                                 | Fetches game catalog in JSON format.                      |
| Get Users         | GET         | `/api/users`       | 200 OK                                 | Fetches the list of users in JSON format.                 |
| Get User by ID    | GET         | `/api/users/:id`   | 200 OK, 400 Bad Request, 404 Not Found | Fetches user data for a specific user in JSON format.     |
| Create User       | POST        | `/api/user`        | 201 Created, 400 Bad Request           | Creates a new user with the provided data.                |
| Update User       | PUT         | `/api/user/:id`    | 200 OK, 400 Bad Request, 404 Not Found | Updates user fields and/or per-game scores for a user.    |
| Delete User       | DELETE      | `/api/user/:id`    | 200 OK, 400 Bad Request, 404 Not Found | Deletes a specific user from the database.                |

## Business Website Routes

| Functionality | HTTP Method | Endpoint   | Return Codes | Description                                 |
| ------------- | ----------- | ---------- | ------------ | ------------------------------------------- |
| About         | GET         | `/about`   | 200 OK       | Renders about content plus platform stats.  |
| Services      | GET         | `/service` | 200 OK       | Renders services and integration guidance.  |
| FAQ           | GET         | `/faq`     | 200 OK       | Renders frequently asked questions.         |
| Contact       | GET         | `/contact` | 200 OK       | Renders support and communication channels. |

## Request and Response Notes

1. `GET /api/leaderboard`
   - Optional query parameters:
     - `limit` (positive integer).
     - `game` (game ID such as `apex-arena`, `turbo-drift`, `dark-siege`, `neon-blitz`).
   - `400 Bad Request` if `limit` is invalid.
   - `400 Bad Request` if `game` does not exist.
2. `GET /api/games`
   - Returns all games with IDs, names, genres, and descriptions.
3. `GET /api/users`
   - Optional query parameters:
     - `q`: text search across player fields.
     - `sort`: `id`, `name`, or `score`.
4. `GET /api/users/:id`
   - Returns `400 Bad Request` when `id` is not a positive integer.
5. `POST /api/user`
   - Requires `firstName` and `lastName`.
   - Optional fields: `scores`, `address`, `email`, `phone`, `website`, `company`, `country`, `team`.
6. `PUT /api/user/:id`
   - Accepts partial payload updates.
   - `scores` accepts partial objects and merges into existing per-game scores.
   - Returns `400 Bad Request` for empty or invalid update payloads.

## Data Shape (User)

```json
{
  "id": 11,
  "firstName": "Ava",
  "lastName": "Morgan",
  "address": "123 Example Street",
  "email": "ava@example.com",
  "phone": "123-456-7890",
  "website": "ava.gg",
  "company": "Guild Ventures",
  "country": "Romania",
  "team": "Skyline Division",
  "scores": {
    "apex-arena": 410,
    "turbo-drift": 870,
    "dark-siege": 650,
    "neon-blitz": 920
  }
}
```

**API Usage Examples**

<!--  @TODO: setup SwaggerUI for interactive API documentation and testing, or provide curl/Postman examples for key endpoints instead of static request/response pairs below. -->

1. Fetch overall leaderboard
   Request:

```json

```

Response:

```json

```

2. Fetch per-game leaderboard
3. Fetch user profile
4. Create a new user
5. Update user scores
6. Delete a user
7. Fetch game catalog
8. Fetch business page content

**Response Codes Explained**

- `200 OK`: The request was successful, and the server returned the requested data or rendered the requested page.
- `201 Created`: The request was successful, and a new resource was created as a result.
- `400 Bad Request`: The server could not understand the request due to invalid syntax or missing required parameters.
- `404 Not Found`: The requested resource could not be found on the server.
- `500 Internal Server Error`: The server encountered an unexpected condition that prevented it from fulfilling the request.
- `503 Service Unavailable`: The server is currently unable to handle the request due to temporary overload or maintenance.
- `504 Gateway Timeout`: The server did not receive a timely response from an upstream server while acting as a gateway or proxy.
- `401 Unauthorized`: The request requires user authentication, and the client has not provided valid credentials.
- `403 Forbidden`: The server understood the request but refuses to authorize it, typically due to insufficient permissions.
- `422 Unprocessable Entity`: The server understands the content type of the request entity, but was unable to process the contained instructions, often due to semantic errors in the request data.
- `429 Too Many Requests`: The user has sent too many requests in a given amount of time ("rate limiting").
- `304 Not Modified`: The requested resource has not been modified since the last request, allowing the client to use cached data.
- `204 No Content`: The server successfully processed the request, but is not returning any content, often used for successful DELETE requests.
- `202 Accepted`: The request has been accepted for processing, but the processing has not been completed, often used for asynchronous operations.
- `409 Conflict`: The request could not be completed due to a conflict with the current state of the resource, often used when trying to create a resource that already exists or when there are conflicting updates.

5. **Business Rules**
1. Scores are always attributable to a specific title. There is no vanity aggregation.
1. Higher score in a game = better rank in that game. No hidden weights or multipliers.
1. Every page on this site has a JSON API equivalent for integrations.
1. Create, update, and delete player records without touching a database.
1. The leaderboard must reflect accurate rankings based on per-game scores and overall totals, with proper handling of concurrent updates and reads.
1. The architecture includes mechanisms for monitoring and exposing key metrics, such as leaderboard freshness and API performance, to ensure operational visibility and facilitate troubleshooting.
1. The architecture supports a seamless user experience with fast page loads, intuitive navigation, and responsive design for compatibility across devices.
1. The architecture includes dedicated pages for business content, such as about, services, FAQ, and contact information, to enhance visibility and credibility with users.

1. **Redundancy & Scalability**
   <!-- @TODO: TBD after initial implementation and testing. -->

   **Redundancy**: TBD after initial implementation and testing.
   **Scalability**: TBD after initial implementation and testing.

1. **Error Handling**
<!-- @TODO: TBD after initial implementation and testing. -->

1. **Security**
<!-- @TODO: TBD after initial implementation and testing. -->

1. **Testing Strategy**

- Unit tests for individual functions and modules.
- Integration tests for API endpoints and data layer interactions.
- End-to-end tests for user flows and overall system functionality.
- Performance tests to ensure the system meets response time requirements.

10. **Deployment Strategy**

- The system will be containerized using Docker for easy deployment across different environments.
- Deployment will be done on a local commercial hosting VPS with Node.js support.
- Continuous Integration/Continuous Deployment (CI/CD) pipelines will be set up to automate testing and deployment processes.
- Monitoring and logging will be implemented to track system performance and identify issues in production.
- The deployment strategy will also include regular backups of the JSON data files to prevent data loss and ensure recoverability in case of failures.

## Architecture Diagrams

<!--
INSTRUCTIONS: Include all relevant diagrams with descriptions.
Recommended diagram types:
- Context Diagram (system boundary and external actors)
- Component Diagram (logical components)
- Deployment Diagram (physical infrastructure)
- Sequence Diagrams (key workflows)
- Data Flow Diagrams
-->

### Context Diagram

<!-- @TODO: Create a context diagram showing the system boundary and external actors/systems. -->

**Purpose**: Shows the system boundary and external actors/systems.
![Context Diagram](./diagrams/context-diagram.png)
[Description of what this diagram shows]

### Component Diagram (Logic View)

<!-- @TODO: Create a component diagram showing the high-level components and their logical relationships. -->

**Purpose**: Illustrates the high-level components and their logical relationships.
![Component Diagram - Logic View](./diagrams/component-logic-diagram.png)
[Description of what this diagram shows]

### Deployment Diagram (Physical View)

<!-- @TODO: Create a deployment diagram showing the deployment topology and infrastructure layout. -->

**Purpose**: Shows the deployment topology and infrastructure layout.
![Deployment Diagram - Physical View](./diagrams/deployment-physical-diagram.png)
[Description of what this diagram shows]

### Technical Diagram

<!-- @TODO: Create a technical diagram showing the technology stack and communication protocols. -->

**Purpose**: Details the technology stack and communication protocols.
![Technical Diagram](./diagrams/technical-diagram.png)
[Description of what this diagram shows]

### Sequence Diagrams

<!-- @TODO: Create sequence diagrams for key workflows - use mermaid syntax -->

#### [Key Workflow 1]

```mermaid

```

**Steps:**

1. [Step 1 description]
2. [Step 2 description]
3. [Step 3 description]

## [Data Architecture](./data_architecture.md)

## [Monitoring and Observability](./monitoring_and_observability.md)

## Performance Optimization

<!--
INSTRUCTIONS: Document performance optimization strategies.
-->

### Caching Strategy

**Cache Layers:**

- **Browser Cache**: [What is cached, TTL]
  **Cache Invalidation:**
- **Strategy**: [e.g., "Time-based / Event-based"]

## [Testing Strategy](./testing-strategy.md)
