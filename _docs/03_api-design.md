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