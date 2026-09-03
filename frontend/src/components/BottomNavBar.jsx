import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { path: '/dashboard', icon: 'home',            label: 'Home'    },
  { path: '/scanner',   icon: 'qr_code_scanner', label: 'Scanner' },
  { path: '/history',   icon: 'history',          label: 'History' },
  { path: '/profile',   icon: 'person',           label: 'Profile' },
]

export default function BottomNavBar() {
  return (
    <nav className="flex-shrink-0 bg-surface-container-lowest border-t border-surface-variant z-50">
      <div className="flex justify-around items-stretch">
        {NAV_ITEMS.map(({ path, icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 flex-1 py-2 min-h-[56px] transition-colors ${
                isActive ? 'text-primary' : 'text-on-surface-variant'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className="material-symbols-outlined text-2xl transition-all"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1, 'wght' 600" : "'FILL' 0, 'wght' 400" }}
                >
                  {icon}
                </span>
                <span className={`text-[10px] font-semibold leading-none ${isActive ? 'font-bold' : ''}`}>
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
