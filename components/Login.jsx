import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import './Auth.css'

export default function Login({ onGoRegister }) {
  const { login, loginWithGoogle } = useAuth()
  const { theme, toggle } = useTheme()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleGoogleLogin = async () => {
    try {
      setError('')
      setLoading(true)
      await loginWithGoogle()
    } catch (err) {
      console.error("Google Login Error:", err.code, err.message, err);
      setError('Failed to sign in with Google. ' + (err.message || ''))
      setLoading(false)
    }
  }

  const handleSubmit = e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      login(form.email, form.password)
    } catch (err) {
      setError('Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-screen">
      <button className="auth-theme-btn" onClick={toggle} title="Toggle theme">
        {theme === 'light' ? '◐' : '◑'}
      </button>

      <div className="auth-left">
        <div className="auth-brand">
          <span className="auth-logo-mark">F</span>
          <span className="auth-logo-text">inHelp</span>
        </div>
        <div className="auth-tagline">
          <h1>Your transactions,<br /><em>safe.</em></h1>
          <p>Track your money - deposits & expenses, every day — without stress.</p>
        </div>

      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h2>Welcome back</h2>
          <p className="auth-subtitle">Sign in to your account</p>

          <button
            type="button"
            className="btn btn-google auth-btn"
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{ marginBottom: '1rem', backgroundColor: '#fff', color: '#333', border: '1px solid #ddd' }}
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '18px', marginRight: '8px', verticalAlign: 'middle' }} />
            Sign in with Google
          </button>

          <div style={{ textAlign: 'center', margin: '1rem 0', color: '#888', fontSize: '0.9rem' }}>OR</div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
            </div>
            <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account?{' '}
            <button className="auth-link-btn" onClick={onGoRegister}>Create one</button>
          </p>
        </div>
      </div>
    </div>
  )
}
