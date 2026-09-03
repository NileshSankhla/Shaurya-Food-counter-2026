import { NavLink } from 'react-router-dom'

const navItems = [
  { path: '/dashboard', icon: 'home', label: 'Home' },
  { path: '/scanner', icon: 'qr_code_scanner', label: 'Scanner' },
  { path: '/history', icon: 'history', label: 'History' },
  { path: '/profile', icon: 'person', label: 'Profile' },
]

export default function BottomNavBar() {
  return (
    <nav className="flex-shrink-0 z-50 bg-surface-container-lowest border-t border-surface-variant shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center px-2 py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center p-2 rounded-xl min-w-[56px] transition-all duration-200 ${
                isActive
                  ? 'text-primary bg-primary-container/20'
                  : 'text-on-surface-variant hover:bg-surface-container-low'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
                <span className={`text-xs mt-0.5 ${isActive ? 'font-bold' : 'font-medium'}`}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
