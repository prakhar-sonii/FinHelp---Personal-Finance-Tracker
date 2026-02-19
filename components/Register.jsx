import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import './Auth.css'

export default function Register({ onGoLogin }) {
  const { register, loginWithGoogle } = useAuth()
  const { theme, toggle } = useTheme()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = e => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) return setError("Passwords don't match.")
    if (form.password.length < 6) return setError('Password must be at least 6 characters.')
    setLoading(true)
    try {
      register(form.name, form.email, form.password)
    } catch (err) {
      if (err.message === 'email-already-in-use') {
        setError('An account with this email already exists.')
      } else {
        setError('Registration failed. Please try again.')
      }
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
          <h1>Start fresh,<br /><em>spend smart.</em></h1>
          <p>A clean slate for your finances. Set up in seconds.</p>
        </div>
        <div className="auth-stats">
          <div className="auth-stat"><span>Offline</span><small>No internet needed</small></div>
          <div className="auth-stat"><span>Secure</span><small>Data stays local</small></div>
          <div className="auth-stat"><span>Fast</span><small>Instant setup</small></div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h2>Create account</h2>
          <p className="auth-subtitle">Get started with FinHelp today</p>

          <button
            type="button"
            className="btn btn-google auth-btn"
            onClick={async () => {
              try {
                setLoading(true);
                await loginWithGoogle();
              } catch (e) {
                setError('Failed to sign up with Google.');
                setLoading(false);
              }
            }}
            disabled={loading}
            style={{ marginBottom: '1rem', backgroundColor: '#fff', color: '#333', border: '1px solid #ddd' }}
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '18px', marginRight: '8px', verticalAlign: 'middle' }} />
            Sign up with Google
          </button>

          <div style={{ textAlign: 'center', margin: '1rem 0', color: '#888', fontSize: '0.9rem' }}>OR</div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Alex Johnson"
                value={form.name}
                onChange={handleChange}
                required
                autoComplete="name"
              />
            </div>
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
            <div className="form-row">
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                />
              </div>
              <div className="form-group">
                <label>Confirm</label>
                <input
                  type="password"
                  name="confirm"
                  placeholder="••••••••"
                  value={form.confirm}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{' '}
            <button className="auth-link-btn" onClick={onGoLogin}>Sign in</button>
          </p>
        </div>
      </div>
    </div>
  )
}
