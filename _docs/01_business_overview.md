# Leaderboard: Business Overview

## Product Vision
PulseBoard is a leaderboard website and API for multi-game competitive products.
The service combines two priorities:

1. High-quality player experience through fast per-game ranking pages.
2. Business visibility through platform metrics and operational pages.

## Business Context
- Industry: Online Gaming
- Goal: Support growth from early adopters to high-volume player traffic.
- Target Personas:
	- Players who want clear ranking and profile visibility.
	- Business operators who need reliable engagement and performance data.

## Core Value Propositions
1. Transparent ranking system: Each game has its own leaderboard with clear sorting by score.
2. Cross-game visibility: Players can be compared per game and on an overall leaderboard.
3. Low-friction user management: Teams can create, update, and remove players through APIs.
4. Website + API parity: Every critical user and leaderboard flow is available in both HTML and JSON.

## Success Metrics
1. Fast response times for leaderboard and users pages.
2. Accurate ranking after each user score update per game.
3. Zero unresolved route gaps between documented endpoints and implementation.

## Business Rules
1. Per-game rank is determined by descending score for that game.
2. Overall rank is determined by descending total score across all tracked games.
2. Player profile pages must show detailed identity and contact metadata.
3. Player profile pages must show a per-game score breakdown.
4. Invalid user profile requests must return a dedicated not-found experience.
5. Public API contracts must return predictable status codes for success and errors.

## Website Pages
1. Home page (`/` and `/home`) with product summary and top overall players.
2. Leaderboard page (`/leaderboard`) with optional game filtering (`?game=<game-id>`).
3. Games catalogue (`/games`) for game discovery and navigation.
4. Players directory (`/users`) for discovery and search.
5. Player profile page (`/users/:id`) for identity and per-game scores.
6. Business content pages (`/about`, `/service`, `/faq`, `/contact`).
