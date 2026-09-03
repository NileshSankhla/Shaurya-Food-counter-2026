export default function TopAppBar() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-surface-container-lowest border-b border-surface-variant shadow-sm">
      <div className="flex items-center gap-2">
        <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
      </div>
      <h1 className="font-display font-bold text-lg text-primary tracking-wide">CampusEats</h1>
      <button className="text-on-surface-variant hover:text-primary transition-colors">
        <span className="material-symbols-outlined">notifications</span>
      </button>
    </header>
  )
}
