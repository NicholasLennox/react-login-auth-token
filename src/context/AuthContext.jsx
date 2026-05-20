import { createContext, useContext, useState } from "react";

// 1. Create context
const AuthContext = createContext(null)

// 2. Create provider 
export function AuthProvider({ children }) {

    // Store and share the token itself to authenticate with the server when needed
    const [token, setToken] = useState(localStorage.getItem("token") || null)
    // Store the username to show who is logged in in the nav bar
    const [username, setUsername] = useState(localStorage.getItem("username") || null)

    // 3. Expose login method
    function login(token, username) {
        // Store more permanently to survive refreshes, so you dont need to constantly log in
        localStorage.setItem("token", token)
        localStorage.setItem("username", username)
        setToken(token)
        setUsername(username)
    }

    // 4. Expose logout method
    function logout() {
        // Clear everything (storage and state)
        localStorage.removeItem("token")
        localStorage.removeItem("username")
        setToken(null)
        setUsername(null)
    }

    return (
        // Expose all functionality 
        <AuthContext.Provider value={{ token, username, login, logout, isLoggedIn: !!token }}>
            {children}
        </AuthContext.Provider>
    )
}

// 6. Create custom hook to use AuthContext
export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error("Please call from within AuthProvider")
    return context
}