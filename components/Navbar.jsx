import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import './Navbar.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { theme, toggle } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)

  const userName = user?.displayName || user?.email?.split('@')[0] || 'User'
  const initials = userName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="nav-brand">
          <span className="nav-logo-mark">F</span>
          <span className="nav-logo-text">inHelp</span>
        </div>

        <div className="nav-center">
          <span className="nav-greeting">
            Good {getGreeting()},{' '}
            <strong>{userName.split(' ')[0]}</strong>
          </span>
        </div>

        <div className="nav-right">
          <button className="theme-toggle" onClick={toggle} title="Toggle theme">
            {theme === 'light' ? '◐' : '◑'}
          </button>

          <div className="profile-wrap">
            <button className="profile-btn" onClick={() => setMenuOpen(o => !o)}>
              <div className="avatar">{initials}</div>
            </button>
            {menuOpen && (
              <div className="profile-menu">
                <div className="profile-info">
                  <p className="profile-name">{userName}</p>
                  <p className="profile-email">{user?.email}</p>
                </div>
                <hr className="menu-divider" />
                <button
                  className="menu-item danger"
                  onClick={() => { logout(); setMenuOpen(false) }}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}
