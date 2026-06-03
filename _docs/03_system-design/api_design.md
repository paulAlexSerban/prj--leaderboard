# API Design

## Routes & Endpoints

<!-- @TODO: Maintain parity between documented and implemented routes. Consider using Swagger/OpenAPI for interactive documentation and testing. -->

### Web Routes

| Functionality     | HTTP Method | Endpoint       | Return Codes          | Description                                               |
| ----------------- | ----------- | -------------- | --------------------- | --------------------------------------------------------- |
| Home Page         | GET         | `/`            | 200 OK                | Renders home content and top overall players.             |
| Home Alias        | GET         | `/home`        | 200 OK                | Renders the same content as `/`.                          |
| Leaderboard Page  | GET         | `/leaderboard` | 200 OK                | Renders overall leaderboard or game-filtered leaderboard. |
| Games Page        | GET         | `/games`       | 200 OK                | Renders game catalog and game navigation links.           |
| Users Page        | GET         | `/users`       | 200 OK                | Renders the users page with the list of users.            |
| User Profile Page | GET         | `/users/:id`   | 200 OK, 404 Not Found | Renders the user profile with per-game scores.            |
| About             | GET         | `/about`       | 200 OK                | Renders about content plus platform stats.                |
| Services          | GET         | `/service`     | 200 OK                | Renders services and integration guidance.                |
| FAQ               | GET         | `/faq`         | 200 OK                | Renders frequently asked questions.                       |
| Contact           | GET         | `/contact`     | 200 OK                | Renders support and communication channels.               |

### API Endpoints

| Functionality   | HTTP Method | Endpoint           | Return Codes                           | Description                                            |
| --------------- | ----------- | ------------------ | -------------------------------------- | ------------------------------------------------------ |
| Get Leaderboard | GET         | `/api/leaderboard` | 200 OK, 400 Bad Request                | Fetches overall or per-game leaderboard JSON payload.  |
| Get Games       | GET         | `/api/games`       | 200 OK                                 | Fetches game catalog in JSON format.                   |
| Get Users       | GET         | `/api/users`       | 200 OK                                 | Fetches the list of users in JSON format.              |
| Get User by ID  | GET         | `/api/users/:id`   | 200 OK, 400 Bad Request, 404 Not Found | Fetches user data for a specific user in JSON format.  |
| Create User     | POST        | `/api/user`        | 201 Created, 400 Bad Request           | Creates a new user with the provided data.             |
| Update User     | PUT         | `/api/user/:id`    | 200 OK, 400 Bad Request, 404 Not Found | Updates user fields and/or per-game scores for a user. |
| Delete User     | DELETE      | `/api/user/:id`    | 200 OK, 400 Bad Request, 404 Not Found | Deletes a specific user from the database.             |

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
