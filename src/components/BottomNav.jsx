import { NavLink, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/', icon: '⊞', label: 'Accueil', exact: true },
  { to: '/session', icon: '⚡', label: 'Séance' },
  { to: '/program', icon: '📅', label: 'Programme' },
  { to: '/history', icon: '🕐', label: 'Historique' },
  { to: '/profile', icon: '👤', label: 'Profil' },
]

export default function BottomNav() {
  const location = useLocation()

  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map(item => {
        const isActive = item.exact
          ? location.pathname === item.to
          : location.pathname.startsWith(item.to)
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={`nav-item${isActive ? ' active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        )
      })}
    </nav>
  )
}
