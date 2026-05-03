# Services

PulseBoard delivers ranked competitive data for four live gaming titles through a unified
web interface and JSON API.

## Per-Game Leaderboards

Each game maintains its own independent ranking. Scores are isolated per title, so a player's
Apex Arena rank does not pollute their Turbo Drift standing.

- `GET /leaderboard?game=apex-arena` — filtered HTML page
- `GET /api/leaderboard?game=apex-arena` — JSON payload with ranked entries and timestamp

## Overall Cross-Game Rankings

The overall leaderboard aggregates each player's total score across all four games.
This rewards players who compete broadly, not just those who grind a single title.

- `GET /leaderboard` — overall page
- `GET /api/leaderboard` — overall JSON

## Player Management

Operators can create, update, and delete player records over the REST API.
Score updates are per-game — a `PUT` accepts a `scores` object with only the games you want to update.

- `POST /api/user` — create a new player
- `PUT /api/user/:id` — update fields including per-game scores
- `DELETE /api/user/:id` — remove a player

## Games Catalogue

All four supported titles and their descriptions are available at `/games` and via `GET /api/games`.
