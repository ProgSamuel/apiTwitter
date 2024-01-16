# Twitter API Project

This is a simple API for a microblogging system similar to Twitter. The project is built with Node.js, Express, and uses Prisma as an ORM to interact with a database.

## Installation

1. Make sure you have Node.js installed on your machine.

2. Clone this repository:

```bash

git  clone  https://github.com/your-username/twitter-api.git

cd  twitter-api

```

3. Install dependencies:

```bash

npm  install

```

4. Create a `.env` file at the root of the project and configure the necessary environment variables. Refer to the `.env.example` file for an example.

5. Run the application:

```bash

npm  start

```

The API will be available at `http://localhost:3335`.

## Endpoints

The API has the following endpoints:

### User

- `POST /createuser`: Creates a new user. Requires a request body containing user information, such as:

```json
{
  "name": "User Name",

  "email": "user@email.com",

  "username": "username",

  "password": "password123"
}
```

- `POST /user/login`: Authenticates a user. Requires a request body containing login credentials, such as:

```json
{
  "email": "user@email.com",

  "password": "password123"
}
```

- `PUT /user/:idUser/updateUser`: Updates user information. Requires a request body with at least one of the fields to be updated, such as:

```json
{
  "name": "New Name",

  "email": "newemail@email.com",

  "username": "newusername",

  "password": "newpassword"
}
```

- `DELETE /user/:idUser/delete`: Deletes a user. Does not require a request body.

### Twitter

- `GET /user/:idUser/home`: Gets the user's tweets. Does not require a request body.

- `POST /user/:idUser/createtwitter`: Creates a new tweet. Requires a request body with the tweet content, such as:

```json
{
  "content": "Tweet Content"
}
```

- `PUT /user/:idUser/updateTwitter/:idTwitter`: Updates a tweet. Requires a request body with the new tweet content, such as:

```json
{
  "content": "New Tweet Content"
}
```

- `DELETE /user/:idUser/deleteTwitter/:idTwitter`: Deletes a tweet. Does not require a request body.

### Reply

- `POST /user/:idUser/reply/:idTwitter`: Responds to a tweet. Requires a request body with the reply content, such as:

```json
{
  "content": "Reply Content"
}
```

- `PUT /user/:idUser/updateReply/:idTwitter`: Updates a reply. Requires a request body with the new reply content, such as:

```json
{
  "content": "New Reply Content"
}
```

- `DELETE /user/:idUser/deleteReply/:idTwitter`: Deletes a reply. Does not require a request body.

### Like

- `POST /user/:idUser/like/:twitterId`: Likes or unlikes a tweet. Does not require a request body.

### Follow

## Route

- `POST /user/:idUser/follow/:idFollow`

This route is responsible for allowing a user to follow another user.

### Route Parameters

- `idUser` (path parameter): ID of the user initiating the follow action.
- `idFollow` (path parameter): ID of the user being followed.

### Expected Input

No request body is needed as the parameters are provided in the URL.

### Behavior

1. Checks the existence of the users involved in the action (the follower and the followed).
2. Ensures that the user is not trying to follow themselves.
3. Checks if a follower relationship already exists between the users. If it does, the relationship is removed, indicating that the user is unfollowing.
4. If no follower relationship exists, a new relationship is created, indicating that the user is starting to follow.

---

## Authentication Middleware

The API uses middleware to check user authentication before allowing certain actions. The middleware is located in `middlewares/checkId.ts` and is used in routes that require authentication. It checks if the authorization token matches the user's token in the database.

```typescript
import { Request, Response } from 'express';

import repository from '../database/prisma.repository';

import { notFound, serverError } from '../Utils/response.helper';

export const checkId = async (
  req: Request,

  res: Response,

  next: () => void
) => {
  try {
    // ... (middleware code)

    next();
  } catch (error) {
    return serverError(res, error);
  }
};
```

Make sure to include the authorization token in the request header when performing operations that require authentication.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
