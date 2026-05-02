# API Design
## Endpoints

| Functionality     | HTTP Method | Endpoint           | Return Codes                           | Description                                               |
| ----------------- | ----------- | ------------------ | -------------------------------------- | --------------------------------------------------------- |
| Leaderboard Page  | GET         | `/`                | 200 OK                                 | Renders the leaderboard page with the latest data.        |
| Users Page        | GET         | `/users`           | 200 OK                                 | Renders the users page with the list of users.            |
| User Profile Page | GET         | `/users/:id`       | 200 OK, 404 Not Found                  | Renders the user profile page for a specific user.        |
| Get Leaderboard   | GET         | `/api/leaderboard` | 200 OK                                 | Fetches the leaderboard data in JSON format.              |
| Get Users         | GET         | `/api/users`       | 200 OK                                 | Fetches the list of users in JSON format.                 |
| Get User by ID    | GET         | `/api/users/:id`   | 200 OK, 404 Not Found                  | Fetches the user data for a specific user in JSON format. |
| Create User       | POST        | `/api/user`        | 201 Created, 400 Bad Request           | Creates a new user with the provided data.                |
| Update User       | PUT         | `/api/user/:id`    | 200 OK, 400 Bad Request, 404 Not Found | Updates the user data for a specific user.                |
| Delete User       | DELETE      | `/api/user/:id`    | 200 OK, 404 Not Found                  | Deletes a specific user from the database.                |

## Business Website Routes

| Functionality     | HTTP Method | Endpoint    | Return Codes | Description                                                 |
| ----------------- | ----------- | ----------- | ------------ | ----------------------------------------------------------- |
| Business Overview | GET         | `/about`    | 200 OK       | Renders business context, top players, and announcements.   |
| Legacy Leaderboard Alias | GET   | `/leaderboard` | 200 OK    | Alias route that renders the same content as the root page. |

## Request and Response Notes

1. `GET /api/leaderboard`
	- Optional query parameter: `limit` (positive integer).
	- `400 Bad Request` if `limit` is invalid.
2. `GET /api/users`
	- Optional query parameters:
	  - `q`: text search across player fields.
	  - `sort`: `id`, `name`, or `score`.
3. `GET /api/users/:id`
	- Returns `400 Bad Request` when `id` is not a positive integer.
4. `POST /api/user`
	- Requires `firstName` and `lastName`.
	- Optional fields: `score`, `address`, `email`, `phone`, `website`, `company`, `country`, `team`.
5. `PUT /api/user/:id`
	- Accepts partial payload updates.
	- Returns `400 Bad Request` for empty or invalid update payloads.

## Data Shape (User)

```json
{
  "id": 11,
  "name": "Ava Morgan",
  "score": 745,
  "firstName": "Ava",
  "lastName": "Morgan",
  "address": "123 Example Street",
  "email": "ava@example.com",
  "phone": "123-456-7890",
  "website": "ava.gg",
  "company": "Guild Ventures",
  "country": "Romania",
  "team": "Skyline Division"
}
```