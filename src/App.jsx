import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router'
import NavBar from './components/NavBar'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import { AuthProvider } from './context/AuthContext'

function App() {

  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
