import { useState, useEffect, useMemo, useCallback } from 'react'
import { getHistory } from '../api/client'

const FILTERS = ['All Scans', 'Success', 'Failed']

function formatDateTime(dateStr) {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
}

export default function HistoryPage() {
  const [allData, setAllData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeFilter, setActiveFilter] = useState('All Scans')
  const [searchQuery, setSearchQuery] = useState('')

  const fetchHistory = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getHistory()
      setAllData(Array.isArray(data) ? data : [])
    } catch (err) {
      setError('Could not load history. Check connection.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchHistory() }, [fetchHistory])

  const filteredData = useMemo(() => {
    let d = allData
    if (activeFilter === 'Success') d = d.filter(i => i.status === 'success')
    else if (activeFilter === 'Failed') d = d.filter(i => i.status === 'failed')

    const q = searchQuery.trim().toLowerCase()
    if (q) {
      d = d.filter(i =>
        i.studentId?.toLowerCase().includes(q) ||
        i.mealType?.toLowerCase().includes(q) ||
        i.reason?.toLowerCase().includes(q)
      )
    }
    return d
  }, [allData, activeFilter, searchQuery])

  return (
    <div className="flex flex-col h-full">

      {/* ── Sticky header ── */}
      <div className="flex-shrink-0 bg-surface/95 backdrop-blur-md border-b border-surface-variant px-4 pt-4 pb-3 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h1 className="font-display text-2xl font-bold text-on-surface">Scan History</h1>
          <button
            onClick={fetchHistory}
            disabled={isLoading}
            aria-label="Refresh history"
            className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors disabled:opacity-50"
          >
            <span className={`material-symbols-outlined text-xl ${isLoading ? 'animate-spin' : ''}`}>refresh</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl pointer-events-none">search</span>
          <input
            type="search"
            placeholder="Search by student ID or meal..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-surface-container-low rounded-xl text-sm text-on-surface placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-semibold transition-colors flex-shrink-0 ${
                activeFilter === f
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── Feed ── */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
        {error && (
          <div className="flex items-center gap-2 p-3 bg-error-container text-on-error-container rounded-2xl text-sm">
            <span className="material-symbols-outlined text-base">error</span>{error}
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center py-16">
            <span className="material-symbols-outlined animate-spin text-primary" style={{ fontSize: 40 }}>refresh</span>
          </div>
        )}

        {!isLoading && !error && filteredData.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-on-surface-variant/60">
            <span className="material-symbols-outlined mb-2" style={{ fontSize: 48 }}>manage_search</span>
            <p className="text-sm font-medium">No records found</p>
          </div>
        )}

        {filteredData.map((item, idx) => {
          const isSuccess = item.status === 'success'
          return (
            <div
              key={item._id || idx}
              className="bg-surface-container-lowest rounded-2xl border border-surface-variant shadow-sm p-4 flex gap-3 items-start"
            >
              {/* Status icon */}
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                isSuccess ? 'bg-green-100 text-green-700' : 'bg-error-container text-on-error-container'
              }`}>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {isSuccess ? 'check_circle' : 'cancel'}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2 mb-0.5">
                  <span className={`text-sm font-bold uppercase ${isSuccess ? 'text-green-700' : 'text-error'}`}>
                    {item.status} &bull; {item.mealType || '—'}
                  </span>
                  <span className="text-xs text-on-surface-variant whitespace-nowrap flex-shrink-0">{formatDateTime(item.createdAt)}</span>
                </div>
                <p className="text-sm font-medium text-primary font-mono truncate">
                  {item.studentId}
                </p>
                {item.reason && (
                  <p className="text-xs text-on-surface-variant mt-0.5 truncate">{item.reason}</p>
                )}
              </div>
            </div>
          )
        })}

        {/* Bottom padding so last item isn't hidden */}
        <div className="h-2" />
      </div>
    </div>
  )
}
