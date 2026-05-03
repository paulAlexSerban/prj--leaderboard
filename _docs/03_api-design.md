# API Design
## Endpoints

| Functionality              | HTTP Method | Endpoint           | Return Codes                           | Description                                                  |
| -------------------------- | ----------- | ------------------ | -------------------------------------- | ------------------------------------------------------------ |
| Home Page                  | GET         | `/`                | 200 OK                                 | Renders home content and top overall players.               |
| Home Alias                 | GET         | `/home`            | 200 OK                                 | Renders the same content as `/`.                            |
| Leaderboard Page           | GET         | `/leaderboard`     | 200 OK                                 | Renders overall leaderboard or game-filtered leaderboard.    |
| Games Page                 | GET         | `/games`           | 200 OK                                 | Renders game catalog and game navigation links.             |
| Users Page                 | GET         | `/users`           | 200 OK                                 | Renders the users page with the list of users.              |
| User Profile Page          | GET         | `/users/:id`       | 200 OK, 404 Not Found                  | Renders the user profile with per-game scores.              |
| Get Leaderboard            | GET         | `/api/leaderboard` | 200 OK, 400 Bad Request                | Fetches overall or per-game leaderboard JSON payload.       |
| Get Games                  | GET         | `/api/games`       | 200 OK                                 | Fetches game catalog in JSON format.                        |
| Get Users                  | GET         | `/api/users`       | 200 OK                                 | Fetches the list of users in JSON format.                   |
| Get User by ID             | GET         | `/api/users/:id`   | 200 OK, 400 Bad Request, 404 Not Found | Fetches user data for a specific user in JSON format.       |
| Create User                | POST        | `/api/user`        | 201 Created, 400 Bad Request           | Creates a new user with the provided data.                  |
| Update User                | PUT         | `/api/user/:id`    | 200 OK, 400 Bad Request, 404 Not Found | Updates user fields and/or per-game scores for a user.      |
| Delete User                | DELETE      | `/api/user/:id`    | 200 OK, 400 Bad Request, 404 Not Found | Deletes a specific user from the database.                  |

## Business Website Routes

| Functionality     | HTTP Method | Endpoint    | Return Codes | Description                                               |
| ----------------- | ----------- | ----------- | ------------ | --------------------------------------------------------- |
| About             | GET         | `/about`    | 200 OK       | Renders about content plus platform stats.               |
| Services          | GET         | `/service`  | 200 OK       | Renders services and integration guidance.               |
| FAQ               | GET         | `/faq`      | 200 OK       | Renders frequently asked questions.                      |
| Contact           | GET         | `/contact`  | 200 OK       | Renders support and communication channels.              |

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