import { NavLink } from 'react-router-dom'
import { Home, Plus, FolderOpen, History, User } from 'lucide-react'

export default function Navigation() {
  const navItems = [
    { path: '/', icon: Home, label: 'Accueil' },
    { path: '/categories', icon: FolderOpen, label: 'Budget' },
    { path: '/add', icon: Plus, label: 'Ajouter', highlight: true },
    { path: '/history', icon: History, label: 'Historique' },
    { path: '/profile', icon: User, label: 'Profil' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map(({ path, icon: Icon, label, highlight }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                highlight
                  ? 'text-primary'
                  : isActive
                  ? 'text-primary'
                  : 'text-gray-500 hover:text-primary'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {highlight ? (
                  <div className="bg-primary text-white rounded-full p-3 -mt-6 shadow-lg">
                    <Icon className="w-6 h-6" />
                  </div>
                ) : (
                  <Icon className={`w-6 h-6 ${isActive ? 'stroke-2' : ''}`} />
                )}
                <span className={`text-xs mt-1 ${highlight ? 'opacity-0' : ''}`}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
