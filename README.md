# NextAuth.js Custom Credentials Authentication with Token Refresh

This project demonstrates a mock authentication setup using **NextAuth.js** with the **Credentials Provider**, including mock access and refresh token handling logic.

## 🔐 Authentication Flow

### 1. **Credentials Provider Setup**

The app uses `next-auth/providers/credentials` to simulate a login system where:

- Users enter email and password on the login form.
- These credentials are compared against `.env` values:
  ```env
  LOGIN_USERNAME=admin@example.com
  LOGIN_PASSWORD=password
  ```

If the credentials match, a user object is returned containing:

- `accessToken`: `"mock-access-token"`
- `refreshToken`: `"mock-refresh-token"`
- `accessTokenExpires`: (current time + 120 mins)

### 2. **JWT Session Strategy**

The session strategy is set to `jwt`, meaning the session is stored in a JSON Web Token instead of the database.

```ts
session: {
  strategy: 'jwt',
  maxAge: 6 * 60 * 60, // 6 hours
},
```

The JWT callback handles:

- **Initial login**: Stores access/refresh tokens in the JWT.
- **Token refresh**: If `accessTokenExpires` is in the past, a new mock token is generated via `refreshAccessToken()`.
- **Refresh failure**: Adds a token error if refresh fails.

### 3. **Session Callback**

The `session` callback attaches the `accessToken`, `refreshToken`, and potential `error` to the session object returned to the client.

```ts
session.accessToken = token.accessToken;
session.refreshToken = token.refreshToken;
session.error = token.error;
```

### 4. **API Route Handler**

The API handler for authentication is set up like so:

```ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

This enables `/api/auth/[...nextauth]` for both GET and POST requests.

### 5. **Environment Variables**

Make sure to define the following in your `.env` file:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<your-secret>
JWT_SECRET=<your-jwt-secret>
LOGIN_USERNAME=admin@example.com
LOGIN_PASSWORD=password
```

> Note: These secrets are required to sign/verify the JWT tokens.

---

## 🚀 How Token Refresh Works

A mock function `refreshAccessToken(refreshToken)` is provided to simulate how token renewal would work with a real backend:

```ts
if (refreshToken === "mock-refresh-token") {
    return {
        accessToken: "new-mock-access-token",
        refreshToken: "new-mock-refresh-token",
        accessTokenExpires: Date.now() + 120 * 60 * 1000,
    };
}
```

If the token is invalid or expired, an error is thrown and added to the session object.

---

## 📄 Pages

The `signIn` page is customized via:

```ts
pages: {
  signIn: '/login'
}
```

Ensure `/login` route exists in your application to handle login UI.

---

## ✅ Summary

- Uses NextAuth.js with credentials-based login.
- Simulates access and refresh token handling.
- Custom JWT and session callback logic.
- Basic `.env` based credential mock.

---

This setup is ideal for testing or prototyping token-based flows before integrating with a real authentication server.