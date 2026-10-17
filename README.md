# URL Shortener API

A RESTful URL Shortener API built with Node.js, Express.js, and PostgreSQL.

The application allows users to convert long URLs into shorter, shareable links. It also supports URL redirection, click tracking, URL management, search, pagination, authentication, authorization, rate limiting, and URL expiration.

## Features

- Create short URLs from long URLs.
- Generate unique short codes.
- Redirect short URLs to their original destinations.
- Track the number of clicks on each short URL.
- Retrieve information about a short URL.
- Delete short URLs.
- Paginate URL listings.
- Register and authenticate users.
- Protect endpoints using JSON Web Tokens (JWT).
- Restrict users to managing their own URLs.
- Apply rate limiting to reduce excessive requests.
- Validate request data.
- Store application data in PostgreSQL.

## Prerequisites

Make sure you have installed:

- Node.js
- npm
- PostgreSQL
- Postman (optional, for testing)

## Running the Application

Start the development server:

```bash
npm start

```

The API will be available at:

```text
http://localhost:5000
```

Check the root endpoint:

```http
GET /
```

Example response:

```json
{
  "message": "URL Shortener API is running"
}
```

## API Endpoints

The examples below assume the API uses the routes described in this documentation. Confirm the route paths in your application.

### Authentication Endpoints

#### 1. Register a User

**Endpoint**

```http
POST /api/auth/register
```

**Request Body**

```json
{
  "name": "John",
  "email": "john@example.com",
  "password": "Password123"
}
```

**Purpose**

Creates a new user account. The password should be hashed before it is stored in the database.

**Possible Responses**

- `201 Created` — Account created successfully.
- `400 Bad Request` — Invalid or missing input.
- `409 Conflict` — Email already registered.

#### 2. Login

**Endpoint**

```http
POST /api/auth/login
```

**Request Body**

```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

**Purpose**

Authenticates a user and returns a JWT if the credentials are valid.

**Example Response**

```json
{
  "message": "Login successful",
  "token": "<JWT_TOKEN>",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

Use the returned token when accessing protected endpoints.

### URL Endpoints

#### 3. Create a Short URL

**Endpoint**

```http
POST /api/urls
```

**Authentication**

Required if URL creation is protected in your implementation.

**Request Body**

```json
{
  "url": "https://github.com"
}
```

**Example Response**

```json
{
  "originalUrl": "https://github.com",
  "shortCode": "aB92xK"
}
```

Your actual response may include additional fields.

**Possible Responses**

- `201 Created` — New short URL created.
- `400 Bad Request` — Invalid URL or expiration date.
- `401 Unauthorized` — Authentication required.
- `429 Too Many Requests` — Rate limit exceeded.
- `500 Internal Server Error` — Unexpected server error.

#### 4. Redirect to the Original URL

**Endpoint**

```http
GET /:shortCode
```

**Example**

```http
GET /aB92xK
```

**Purpose**

Looks up the short code and redirects the visitor to the original URL.

Each successful redirect increments the click counter.

**Possible Responses**

- `302 Found` — Redirects to the original URL.
- `404 Not Found` — Short URL does not exist or is unavailable.
- `429 Too Many Requests` — Rate limit exceeded, if this route is limited.
- `500 Internal Server Error` — Unexpected server error.

#### 5. Get URL Details

**Endpoint**

```http
GET /api/urls/:shortCode
```

**Example**

```http
GET /api/urls/aB92xK
```

**Purpose**

Returns information about a short URL, such as its original URL, short code, creation date, expiration date, and click count.

If URL management is private, the endpoint should require authentication and verify ownership.

**Example Response**

```json
{
  "originalUrl": "https://github.com",
  "shortCode": "aB92xK",
  "clicks": 15,
  "createdAt": "2026-10-01T10:00:00.000Z",
  "expiresAt": null
}
```

#### 6. List URLs

**Endpoint**

```http
GET /api/url
```

**Purpose**

Returns a list of URLs. If authentication is enabled, the endpoint should return only the authenticated user's URLs.

#### 7. Search URLs

**Endpoint**

```http
GET /api/urls?search=github
```

**Purpose**

Searches URLs by their original URL.

The search can be combined with pagination:

```http
GET /api/urls?search=github&page=1&limit=10
```

#### 8. Paginate URLs

**Endpoint**

```http
GET /api/url?page=1&limit=10
```

**Query Parameters**

| Parameter | Description                | Example  |
| --------- | -------------------------- | -------- |
| `page`    | Page number                | `1`      |
| `limit`   | Number of records per page | `10`     |
| `search`  | Optional search term       | `github` |

**Example Response**

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

The response structure depends on the implementation of your pagination route.

#### 9. Delete a Short URL

**Endpoint**

```http
DELETE /api/url/:shortCode
```

**Example**

```http
DELETE /api/url/aB92xK
```

**Purpose**

Deletes a short URL.

If authorization is enabled, the API must verify that the authenticated user owns the URL.

**Possible Responses**

- `204 No Content` — URL deleted successfully.
- `401 Unauthorized` — Authentication required.
- `404 Not Found` — URL not found or not accessible to the user
- `429 Too Many Requests` — Rate limit exceeded, if applicable.

## Authentication

Protected endpoints use JSON Web Tokens (JWT).

After logging in, copy the returned token.

In Postman, open the **Authorization** tab:

1. Select **Bearer Token**.
2. Paste the token.
3. Send the request.

Alternatively, include this HTTP header:

```http
Authorization: Bearer <JWT_TOKEN>
```

The server verifies the token and identifies the authenticated user.

For user-owned resources, the API should also check ownership before allowing access, updates, or deletion.

## Rate Limiting

The API uses `express-rate-limit` to restrict excessive requests.

The response uses:

```http
429 Too Many Requests
```

Example:

```json
{
  "message": "Too many requests. Please try again later."
}
```

Actual limits depend on the middleware configuration applied to each route.

## URL Expiration

A short URL can optionally have an expiration date.

Example:

```json
{
  "url": "https://github.com",
  "expiresAt": "2026-11-01T12:00:00Z"
}
```

The exact response body depends on the route implementation.

## Future Improvements

Potential improvements include:

- API documentation using Swagger/OpenAPI.
- Refresh tokens and token revocation.
- Automated unit and integration tests.
- Deployment and monitoring.

## Author

**Kwabena Nkrumah**

Built as a backend development learning project using Node.js, Express.js, and PostgreSQL
