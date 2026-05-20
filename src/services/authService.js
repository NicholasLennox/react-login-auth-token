const API_URL = "http://localhost:5272"

export default async function loginUser(username, password) {
    // Fetch - POST to server, content type of application/json, passing the username and password
    const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ username, password })
    })

    if(!res.ok) throw new Error('Invalid username or password')

    const data = await res.json()

    return data.token
}