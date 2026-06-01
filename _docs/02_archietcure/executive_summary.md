# Executive Summary

PulseBoard is a multi-game leaderboard platform designed to provide transparent and real-time competitive standings for gaming organizations. The system follows a layered architecture with a clear separation of concerns between the presentation layer (SSR routes), domain layer (controllers), and data layer (JSON file storage).

![](./_diagrams/01_block_diagram__architecture_evolution__phase_0_to_phase_2-2505042021.png)

**Architecture Style**: Layered architecture with a focus on modularity and separation of concerns.

**Key Components**:

1. **Web Layer**: Built with Express.js and Handlebars for server-side rendering. It handles all HTTP requests, rendering of HTML pages, and serving static assets.
2. **Domain Layer**: Contains controllers that orchestrate the business logic, including data retrieval and manipulation. It also handles input validation and ensures that the business rules are enforced.
3. **Data Layer**: Uses JSON file storage to persist game catalog, player data, scores, and announcements. It provides an in-memory cache for efficient read/write operations.
4. **API Layer**: Exposes RESTful endpoints for fetching leaderboard data, game information, and user management operations. It ensures that all API responses are consistent and follow the defined contracts.
5. **Business Website Pages**: Provides static content about the business, its services, and contact information, enhancing visibility and credibility.

**Technology Stack**:

- Node.js 24
- Express.js for web server and routing
- Handlebars for server-side rendering
- JSON file storage for data persistence (game catalog, players, per-game scores)
- Markdown files for business website pages
- Docker for containerization

**Architecture Principles**:

1. **Per-game accuracy over vanity aggregation**: Scores are always attributable to a specific title.
2. **Transparent ranking logic**: Higher score in a game = better rank in that game. No hidden weights.
3. **Full API parity**: Every page on this site has a JSON API equivalent for integrations.
4. **Operational simplicity**: Create, update, and delete player records without touching a database.
5. **Scalability and Performance**: The architecture is designed to handle increasing user traffic while maintaining low latency for page rendering and API responses.
6. **Reliability and Testability**: The system includes robust error handling and is designed to be testable with unit, integration, and end-to-end tests to ensure functionality and performance.
7. **Integration and Extensibility**: The architecture allows for easy integration with third-party services and internal tools, and is designed to be extensible for future features and enhancements.
8. **Containerization**: The system is designed to be containerized using Docker, facilitating easy deployment and scalability across different environments.
9. **Data Consistency**: The architecture ensures that the leaderboard reflects accurate rankings based on per-game scores and overall totals, with proper handling of concurrent updates and reads.
10. **Observability**: The architecture includes mechanisms for monitoring and exposing key metrics, such as leaderboard freshness and API performance, to ensure operational visibility and facilitate troubleshooting.
11. **User Experience**: The architecture supports a seamless user experience with fast page loads, intuitive navigation, and responsive design for compatibility across devices.
12. **Business Visibility**: The architecture includes dedicated pages for business content, such as about, services, FAQ, and contact information, to enhance visibility and credibility with users.

**System Characteristics**

- High Read-to-Write Ratio: The leaderboard will be read frequently, but updates to user scores will be less frequent.
- Scalability: The system must handle a large number of concurrent users and requests without degradation in performance.
- Data Consistency: The leaderboard must reflect accurate rankings based on per-game scores and overall totals.
