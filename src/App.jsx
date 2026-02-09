import { Routes, Route, Navigate } from 'react-router-dom'
import { useUser } from './context/UserContext'
import Welcome from './pages/Welcome'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import Chatbot from './components/Chatbot/Chatbot'

function App() {
    const { user, isOnboarded } = useUser()

    return (
        <div className="app">
            <Routes>
                <Route
                    path="/"
                    element={isOnboarded ? <Navigate to="/dashboard" /> : <Welcome />}
                />
                <Route
                    path="/onboarding"
                    element={isOnboarded ? <Navigate to="/dashboard" /> : <Onboarding />}
                />
                <Route
                    path="/dashboard"
                    element={isOnboarded ? <Dashboard /> : <Navigate to="/" />}
                />
            </Routes>

            {/* Floating Chatbot - Only show when onboarded */}
            {isOnboarded && <Chatbot />}
        </div>
    )
}

export default App
