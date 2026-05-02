# Frequently Asked Questions

## How are ranks calculated?

Players are ranked by score in descending order. Higher score means better rank.

## Can we update players from external systems?

Yes. Use the user API endpoints to create, update, and delete player records.

## Is there an API for leaderboard retrieval?

Yes. `GET /api/leaderboard` returns ranked entries and a freshness timestamp.

## How do we find one player quickly?

Use `GET /api/users/:id` or filter the players page with search.
