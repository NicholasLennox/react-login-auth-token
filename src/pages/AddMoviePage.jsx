import { use, useState } from "react"
import { addMovie } from "../services/movieService"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router"

export default function AddMoviePage() {

    // State
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [year, setYear] = useState(0)
    const [genre, setGenre] = useState('')
    const [director, setDirector] = useState('')
    const [error, setError] = useState('')

    // Hooks
    const { token } = useAuth()
    const navigate = useNavigate()

    // Handler
    async function handleSubmit() {
        setError('')
        try {
            const response = await addMovie({title, description, year: parseInt(year), genre, director}, token)
            navigate("/")
        } catch (err) {
            setError(err.message)
        }
    }


    return (
        <div className="m-4 mx-auto" style={{maxWidth: '600px'}}>
            <h3>➕ Add Movie</h3>
            <div className="mb-3">
                <label htmlFor="" className="form-label">Title</label>
                <input className="form-control" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="mb-3">
                <label htmlFor="" className="form-label">Description</label>
                <input className="form-control" type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="mb-3">
                <label htmlFor="" className="form-label">Year</label>
                <input className="form-control" type="number" value={year} onChange={(e) => setYear(e.target.value)} />
            </div>
            <div className="mb-3">
                <label htmlFor="" className="form-label">Genre</label>
                <input className="form-control" type="text" value={genre} onChange={(e) => setGenre(e.target.value)} />
            </div>
            <div className="mb-3">
                <label htmlFor="" className="form-label">Director</label>
                <input className="form-control" type="text" value={director} onChange={(e) => setDirector(e.target.value)} />
            </div>
            {error && <p className="text-danger">{error}</p>}
            <button className="btn btn-primary" onClick={handleSubmit}>Submit</button>
        </div>
    )
}