

const API_URL = import.meta.env.VITE_API_URL

export async function getAllMovies() {

    const response = await fetch(`${API_URL}/movies`)

    if(!response.ok) throw new Error('Could not fetch movies')

    const data = await response.json()

    return data
}

export async function getMovieById(id) {

    const response = await fetch(`${API_URL}/movies/${id}`)

    if(!response.ok) throw new Error(`Could not fetch movie with ID: ${id}`)

    const data = await response.json()

    return data
}

export async function addMovie(movie, token) {

    const response = await fetch(`${API_URL}/movies`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(movie)
    })

    if(!response.ok) throw new Error('Could not add movie')

    const data = response.json()

    return data
}