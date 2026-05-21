import { useEffect, useState } from "react"
import { getAllMovies } from "../services/movieService"
import { Link } from "react-router"


export default function HomePage() {

    // State
    const [movies, setMovies] = useState([])
    const [error, setError] = useState('')

    // Load movies
    async function loadMovies() {
        setError('')
        try {
            const loadedMovies = await getAllMovies()
            setMovies(loadedMovies)
        } catch (err) {
            setError(err.message)
        }
    }

    useEffect(() => {
        loadMovies()
    }, [])

    if(error) return <p className="text-danger">{error}</p>

    return (
        <div className="m-4 mx-auto" style={{maxWidth: '600px'}}>
            <h3>Movies</h3>
            <ul className="list-group">
                {movies.map(movie => (
                    <li key={movie.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <span>{movie.title} ({movie.year}) <span className="badge rounded-pill text-bg-primary">{movie.genre}</span></span>
                        <Link to={`/movies/${movie.id}`} className="btn btn-sm btn-outline-primary">View</Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}