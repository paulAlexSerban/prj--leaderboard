# PulseBoard - Leaderboard Service

> - **Document Status**: Draft
> - **Last Updated**: 2026 May 03
> - **Author**: Paul Serban

PulseBoard is an online gaming leaderboard website and API for multi-game competitive products.

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
  - 10 concurent games with 50 concurrent users each
  - API response time & Page rendering time: 1 second for 95th percentile
  - API response time & Page rendering time: 0.5 seconds for 99th percentile
  - API throughput: 500 req/s
  - Page rendering throughput: 100 req/s
  - Page rendering concurrency: 10 concurrent users

**Data Volume Estimation:**
  - 10000 users
  - 50 games
  - 100000 players
  - 1000000 scores
  - 100 announcements

**Service Level Agreement (SLA):**
  - 99.9% availability

**Integration Requirements:**
  - The system must provide a RESTful API for integration with third-party services and internal tools.
  - **Online Gaming**: The system must integrate with popular gaming platforms to fetch player data and scores.

**Infrastructure Constraints:**
  - Local commercial hosting VPS with Node.js support.
  - Containerization using Docker for deployment.

# [Executive Summary](./02_archietcure/executive_summary.md)

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
4. **[API Design](./03_system-design/api_design.md)**

5. **Business Rules**
   1. Scores are always attributable to a specific title. There is no vanity aggregation.
   2. Higher score in a game = better rank in that game. No hidden weights or multipliers.
   3. Every page on this site has a JSON API equivalent for integrations (unless it is a business website page) 
   4. Create, update, and delete player records without touching a database.
   5. The leaderboard must reflect accurate rankings based on per-game scores and overall totals, with proper handling of concurrent updates and reads.
   6.  The architecture includes mechanisms for monitoring and exposing key metrics, such as leaderboard freshness and API performance, to ensure operational visibility and facilitate troubleshooting.
   7.  The architecture supports a seamless user experience with fast page loads, intuitive navigation, and responsive design for compatibility across devices.
   8.  The architecture includes dedicated pages for business content, such as about, services, FAQ, and contact information, to enhance visibility and credibility with users.

6.  **Redundancy & Scalability**
   <!-- @TODO: TBD after initial implementation and testing. -->

   **Redundancy**: TBD after initial implementation and testing.
   **Scalability**: TBD after initial implementation and testing.

7.  **Error Handling**
<!-- @TODO: TBD after initial implementation and testing. -->

8. **Security**
<!-- @TODO: TBD after initial implementation and testing. -->

9. **Testing Strategy**
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
