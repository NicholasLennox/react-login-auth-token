# Movies App - React Authentication

This lesson we built a login flow in React, wired up to a .NET API. You have seen services and context before - here they work together as a complete auth system for the first time.

## What we built

A React + Vite client with two pages:

- `/login` - log in with a username and password
- `/` - home page

As well as a navbar which shows who is logged in with a logout option.

The flow: log in → receive a [JWT](https://jwt.io) from the API → store it in localStorage → show the logged in user in the navbar.

## Running the project

```bash
npm install
npm run dev
```

The API is already hosted and running - you do not need to run it yourself.

**Credentials:**
```
username: nicholas
password: password
```

## The API

The API has the following endpoints:

| Method | URL | Auth required |
|--|--|--|
| POST | `/login` | No |
| GET | `/movies` | No |
| GET | `/movies/{id}` | No |
| POST | `/movies` | ✅ Yes |

You can explore it with Swagger at: 🔗 [Deployed API](https://movies-api-demo.azurewebsites.net/swagger/index.html)

**HTTP verbs** - [MDN reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)

**HTTP status codes** - [MDN reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status). The key ones today were `200` (OK), `201` (Created), and `401` (Unauthorised).


## What is a JWT?

When you log in, the API sends back a [JSON Web Token](https://jwt.io). This is a string that proves you are logged in. You can paste any token into [jwt.io](https://jwt.io) to see what is inside it.

The token contains claims - pieces of information about the user, like their name and role. It is **not encrypted**, just signed, so never put sensitive information in it.



## authService

The service is responsible for one thing: talking to the API. It knows nothing about state, context, or the UI.

```js
const API_URL = "..."

export async function loginUser(username, password) {
    const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })

    if (!res.ok) throw new Error("Invalid username or password")

    const data = await res.json()
    return data.token
}
```

If the response is not OK (4xx, 5xx) we throw an error. This travels up to the login page which decides how to show it.



## AuthContext

You have used Context to share state before. Here it wraps the auth lifecycle: storing the token and username, and exposing `login`, `logout`, and `isLoggedIn` to the rest of the app.

```js
function login(token, username) {
    localStorage.setItem("token", token)
    localStorage.setItem("username", username)
    setToken(token)
    setUsername(username)
}
```

Token and username are initialised from localStorage so a page refresh does not log the user out. On logout, both are cleared.

## Login page

The login page has three pieces of state - `username`, `password`, and `error`. On submit it calls the service, passes the result to context, and navigates to `/`.

```js
async function handleLogin() {
    setError(null)
    try {
        const token = await loginUser(username, password)
        login(token, username)
        navigate("/")
    } catch (err) {
        setError(err.message)
    }
}
```

## The layer separation

It is worth being explicit about who does what:

- **authService** - HTTP calls only. No state, no UI.
- **AuthContext** - owns the token and username, exposes actions.
- **useAuth** - gives components a clean way into the context.
- **LoginPage** - calls the service via context, handles errors, navigates.

Each layer has one job. The login page does not know how the token is stored. The service does not know the token exists.



## Next steps

- Call the protected `POST /movies` endpoint by attaching the token to the request as `Authorization: Bearer <token>`
- Add a `ProtectedRoute` component that redirects to `/login` if there is no token
