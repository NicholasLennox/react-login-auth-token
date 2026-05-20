import { useState } from "react"
import loginUser from "../services/authService"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router"

export default function LoginPage() {

    // State
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    // AuthContext
    const { login } = useAuth()

    // Navigate
    const navigate = useNavigate()


    async function handleSubmit() {
        // Clear error text incase it was there
        setError(null)
        try {
            const token = await loginUser(username, password)
            login(token, username)
            // Function to redirect to a different route
            navigate('/')
        } catch(err) {
            // Either we provided the wrong login details, or the server failed
            setError(err.message)
        }
    }

    return (
        <>
            <div className="m-4 mx-auto" style={{maxWidth: '400px'}}>
                <h3>🔐 Login</h3>
                <div className="mb-2">
                    <label>Username</label>
                    <input className="form-control" type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="mb-2">
                    <label>Password</label>
                    <input className="form-control" type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                { error && <p className="text-danger">{error}</p>}
                <button className="btn btn-primary" onClick={handleSubmit}>Submit</button>

            </div>
        </>
    )
}