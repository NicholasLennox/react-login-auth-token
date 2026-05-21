import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
    
    const { isLoggedIn } = useAuth()

    if(!isLoggedIn) return <Navigate to={'/login'} />

    return children

}