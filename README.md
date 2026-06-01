# Leaderboard

## Architectural evolution phases

### Phase 0 - Base Monolithic Application
> branch: `phase-0--base-monolith`
- full FE + BE MVP implementation with SSR (landing page, business pages, leaderboard, users, games, profile)
- full API implementation with REST endpoints (leaderboard, users, games, profile)
- on single server
- file system storage based on JSON file
- no DB, no cache, no load balancing, no scaling
- docker container with limited resources (1GB RAM, 1GB storage)