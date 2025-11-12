import { NavLink } from 'react-router-dom'

const navigation = [
  {
    name: 'Dashboard',
    path: '/',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
      </svg>
    )
  },
  {
    name: 'Students',
    path: '/students',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    )
  },
  {
    name: 'Teachers',
    path: '/teachers',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    )
  },
  {
    name: 'Attendance',
    path: '/attendance',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="9 11 12 14 22 4"></polyline>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
      </svg>
    )
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M12 1v6m0 6v6m6-12h-6m-6 0H1m17.66 3.66l-4.24 4.24m-6.36 0L3.34 9.66m15.32 9.68l-4.24-4.24m-6.36 0l-4.24 4.24"></path>
      </svg>
    )
  }
]

export default function Sidebar() {
  const userRole = localStorage.getItem('userRole') || 'Administrator'
  const username = localStorage.getItem('username') || 'User'

  const getInitial = (name) => name.charAt(0).toUpperCase()

  return (
    <aside className="w-64 bg-gradient-to-b from-dark-700 to-dark-900 border-r border-dark-600 flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-dark-600">
        <img 
          src="/LOGO WITH NO BACKGROUND.png" 
          alt="Clausen Logo" 
          className="w-full h-auto"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-5 overflow-y-auto">
        {navigation.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <span className="flex items-center justify-center w-5 h-5">
              {item.icon}
            </span>
            <span className="text-sm font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Info */}
      <div className="p-5 border-t border-dark-600">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-dark-900 font-semibold">
            {getInitial(username)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{username}</p>
            <p className="text-primary text-xs">{userRole}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
