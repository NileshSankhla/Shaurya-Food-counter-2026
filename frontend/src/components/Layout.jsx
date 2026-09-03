import { Outlet, useLocation } from 'react-router-dom'
import TopAppBar from './TopAppBar'
import BottomNavBar from './BottomNavBar'

export default function Layout() {
  const { pathname } = useLocation()
  const isScanner = pathname === '/scanner'

  return (
    <div className="flex flex-col h-dvh overflow-hidden">
      {!isScanner && <TopAppBar />}
      <main className={`flex-1 overflow-y-auto ${isScanner ? 'overflow-hidden' : 'pb-16'}`}>
        <Outlet />
      </main>
      <BottomNavBar />
    </div>
  )
}
