# Frequently Asked Questions

## How are ranks calculated?

Within each game, players are ranked by that game's score in descending order.
The overall leaderboard ranks players by the sum of all their game scores.

## Can a player rank highly in multiple games?

Yes, and it is encouraged. A player who scores well across all four titles will rise
higher in the overall standings than a single-game specialist with the same top score.

## Which games does PulseBoard support?

Currently four: **Apex Arena** (Battle Royale), **Turbo Drift** (Racing),
**Dark Siege** (Tower Defense), and **Neon Blitz** (Arcade).
Visit `/games` for the full catalogue with descriptions.

## How do I view a specific game's leaderboard?

Navigate to `/leaderboard?game=<game-id>` or use the game tabs on the leaderboard page.
Valid game IDs: `apex-arena`, `turbo-drift`, `dark-siege`, `neon-blitz`.

## Is there a JSON API for the leaderboard?

Yes. `GET /api/leaderboard` returns the overall ranking.
`GET /api/leaderboard?game=turbo-drift&limit=10` returns the top 10 for Turbo Drift specifically.

## How are player scores updated?

Use `PUT /api/user/:id` with a `scores` object containing only the games you want to update.
Other game scores are preserved — it is a merge, not a replace.

## How do I find a specific player quickly?

Use `GET /api/users/:id` or filter the players page with the search box.
