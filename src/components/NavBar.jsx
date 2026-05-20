import { use } from "react";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {

    // AuthContext
    const { username, logout, isLoggedIn } = useAuth()

    // Navigation
    const navigate = useNavigate()

    function handleLogout() {
        logout()
        navigate('/login')
    }

    return (
        <>
            <nav className="navbar navbar-bg bg-dark">
                <div className="container-fluid">
                    <NavLink className="navbar-brand text-white text-decoration-none" to="/">🎬 Home</NavLink>
                    <div className="d-flex gap-3 align-items-center">
                        {isLoggedIn ? (
                            <>
                                <span className="text-white">👤 {username}</span>
                                <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
                            </>
                        ) : (
                            <NavLink className="text-white text-decoration-none" to="/login">Login</NavLink>
                        )}
                    </div>
                </div>
        </nav >
        </>
    )
}