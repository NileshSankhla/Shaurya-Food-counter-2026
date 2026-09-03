import { Outlet, useLocation } from 'react-router-dom'
import TopAppBar from './TopAppBar'
import BottomNavBar from './BottomNavBar'

export default function Layout() {
  const { pathname } = useLocation()
  const isScanner = pathname === '/scanner'

  return (
    // h-dvh = full viewport height. flex-col stacks: TopBar | main | BottomNav
    <div className="flex flex-col bg-surface" style={{ height: '100dvh', overflow: 'hidden' }}>
      {/* Hide top bar on scanner — camera needs all space */}
      {!isScanner && <TopAppBar />}

      {/* Main content area */}
      <main
        className={`flex-1 min-h-0 ${
          isScanner
            ? 'overflow-hidden'   // scanner needs exact pixel control
            : 'overflow-y-auto'   // other pages scroll normally
        }`}
      >
        <Outlet />
      </main>

      <BottomNavBar />
    </div>
  )
}
