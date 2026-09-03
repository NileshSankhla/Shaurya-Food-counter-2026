export default function TopAppBar() {
  return (
    <header className="flex-shrink-0 z-50 flex items-center justify-between px-4 h-14 bg-surface border-b border-surface-variant relative">
      {/* Logo */}
      <img src="/logo.png" alt="Shaurya Logo" className="h-8 w-8 object-contain" />

      {/* Title — absolutely centered */}
      <h1 className="font-display font-bold text-base text-primary tracking-wide absolute left-1/2 -translate-x-1/2">
        CampusEats
      </h1>

      {/* Notification icon placeholder */}
      <button
        aria-label="Notifications"
        className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
      >
        <span className="material-symbols-outlined text-xl">notifications</span>
      </button>
    </header>
  )
}
