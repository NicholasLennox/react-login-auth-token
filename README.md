# Movies App - React Authentication

This lesson we built a login flow in React, wired up to a .NET API. You have seen services and context before - here they work together as a complete auth system for the first time.

## Contents

- [Lesson 1 - Authentication](#lesson-1---authentication)
- [Lesson 2 - Using the token](#lesson-2---using-the-token)

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

---

## Lesson 1 - Authentication

### What we built

A React + Vite client with two pages:

- `/login` - log in with a username and password
- `/` - home page

As well as a navbar which shows who is logged in with a logout option.

The flow: log in → receive a [JWT](https://jwt.io) from the API → store it in localStorage → show the logged in user in the navbar.

### The API

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

### What is a JWT?

When you log in, the API sends back a [JSON Web Token](https://jwt.io). This is a string that proves you are logged in. You can paste any token into [jwt.io](https://jwt.io) to see what is inside it.

The token contains claims - pieces of information about the user, like their name and role. It is **not encrypted**, just signed, so never put sensitive information in it.

### authService

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

### AuthContext

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

### Login page

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

### The layer separation

It is worth being explicit about who does what:

- **authService** - HTTP calls only. No state, no UI.
- **AuthContext** - owns the token and username, exposes actions.
- **useAuth** - gives components a clean way into the context.
- **LoginPage** - calls the service via context, handles errors, navigates.

Each layer has one job. The login page does not know how the token is stored. The service does not know the token exists.

---

## Lesson 2 - Using the token

### What we built

We extended the app to interact with the movie endpoints, attach the token to protected requests, and guard routes from unauthenticated users.

New pages:

- `/` - lists all movies with a link to each
- `/movies/:id` - full movie details
- `/add` - protected form to add a new movie

### movieService

A dedicated service for movie API calls. `addMovie` takes the token as a parameter and attaches it to the request header.

```js
export async function getAllMovies() {
    const res = await fetch(`${API_URL}/movies`)
    if (!res.ok) throw new Error("Failed to fetch movies")
    return res.json()
}

export async function getMovieById(id) {
    const res = await fetch(`${API_URL}/movies/${id}`)
    if (!res.ok) throw new Error("Failed to fetch movie")
    return res.json()
}

export async function addMovie(movie, token) {
    const res = await fetch(`${API_URL}/movies`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(movie)
    })
    if (!res.ok) throw new Error("Failed to add movie")
    return res.json()
}
```

The token is passed in as a parameter — the service does not reach into context. That keeps the layer separation clean.

### useParams

On the movie details page, `useParams` pulls the `id` out of the URL so we can fetch the right movie.

```js
const { id } = useParams()
```

### ProtectedRoute

A wrapper component that checks `isLoggedIn` from context. If the user is not logged in, they are redirected to `/login` before the page renders.

```jsx
export default function ProtectedRoute({ children }) {
    const { isLoggedIn } = useAuth()

    if (!isLoggedIn) {
        return <Navigate to="/login" />
    }

    return children
}
```

### Environment variables

The API URL lives in a `.env` file at the project root:

```
VITE_API_URL=https://movies-api-demo.azurewebsites.net
```

Vite picks this up automatically — no extra packages needed. The only rule is the variable must start with `VITE_`. Never commit your `.env` to git. When deploying to Vercel, set it under Project Settings → Environment Variables.

```js
const API_URL = import.meta.env.VITE_API_URL
```