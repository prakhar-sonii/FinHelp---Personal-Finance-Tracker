import { useState } from 'react'
import { useAuth } from './context/AuthContext'
import Dashboard from './components/Dashboard'
import Login from './components/Login'
import Register from './components/Register'

export default function App() {
  const { user } = useAuth()
  const [page, setPage] = useState('login')

  if (user) return <Dashboard />
  if (page === 'login') return <Login onGoRegister={() => setPage('register')} />
  return <Register onGoLogin={() => setPage('login')} />
}
