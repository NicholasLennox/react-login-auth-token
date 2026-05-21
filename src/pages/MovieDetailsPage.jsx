import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { getMovieById } from "../services/movieService"

export default function MovieDetailsPage() {

    // State
    const [movie, setMovie] = useState({})
    const [error, setError] = useState('')

    // Hooks
    const { id } = useParams()

    // Load movie
    async function loadMovie() {
        setError('')
        try {
            const loadedMovie = await getMovieById(id)
            setMovie(loadedMovie)
        } catch (err) {
            setError(err.message)
        }
    }

    useEffect(() => {
        loadMovie()
    }, [])

    if(error) return <p className="text-danger">{error}</p>

    return (
        <div className="m-4 mx-auto" style={{maxWidth: '600px'}}>
            <h3>{movie.title} ({movie.year})</h3>
            <p><strong>Director:</strong> {movie.director}</p>
            <p><strong>Genre:</strong> {movie.genre}</p>
            <p><strong>Description:</strong> {movie.description}</p>
        </div>
    )
}