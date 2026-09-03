import { useState, useEffect, useMemo } from 'react'
import { getHistory } from '../api/client'

export default function HistoryPage() {
  const [allData, setAllData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeFilter, setActiveFilter] = useState('All Scans')
  const [searchQuery, setSearchQuery] = useState('')

  const fetchHistory = async () => {
    try {
      setIsLoading(true)
      const data = await getHistory()
      setAllData(Array.isArray(data) ? data : data.history || [])
      setError(null)
    } catch (err) {
      setError('Failed to load history')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const filteredData = useMemo(() => {
    let filtered = allData

    if (activeFilter === 'Success') {
      filtered = filtered.filter(item => item.status === 'success')
    } else if (activeFilter === 'Failed') {
      filtered = filtered.filter(item => item.status === 'failed')
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(item =>
        (item.studentId && item.studentId.toLowerCase().includes(q)) ||
        (item.mealType && item.mealType.toLowerCase().includes(q)) ||
        (item.reason && item.reason.toLowerCase().includes(q))
      )
    }

    return filtered
  }, [allData, activeFilter, searchQuery])

  const formatTime = (dateStr) => {
    if (!dateStr) return ''
    try {
      return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } catch {
      return ''
    }
  }

  return (
    <div className="flex flex-col h-full bg-surface">
      <div className="sticky top-0 z-10 bg-surface/95 backdrop-blur-md pb-4 pt-4 px-4 border-b border-surface-variant">
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-display text-2xl font-bold text-on-surface">Scan History</h1>
          <button
            onClick={fetchHistory}
            className="p-2 rounded-full bg-surface-container-low text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className={`material-symbols-outlined ${isLoading ? 'animate-spin' : ''}`}>refresh</span>
          </button>
        </div>

        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-on-surface-variant">search</span>
          </div>
          <input
            type="text"
            placeholder="Search student ID or meal..."
            className="w-full pl-10 pr-4 py-3 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {['All Scans', 'Success', 'Failed'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeFilter === filter
                  ? 'bg-primary-container text-on-primary-container'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {error && (
          <div className="p-3 bg-error-container text-on-error-container rounded-xl text-sm font-medium mb-4">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center py-12">
            <span className="material-symbols-outlined animate-spin text-primary text-4xl">refresh</span>
          </div>
        )}

        {!isLoading && filteredData.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-12 text-on-surface-variant opacity-70">
            <span className="material-symbols-outlined text-5xl mb-2">history</span>
            <p>No history found</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {filteredData.map((item, index) => (
            <div
              key={item._id || index}
              className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-surface-variant flex gap-4 items-center"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                item.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-error-container text-on-error-container'
              }`}>
                <span className="material-symbols-outlined">
                  {item.status === 'success' ? 'check_circle' : 'error'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-on-surface truncate pr-2 uppercase text-sm">
                    {item.status} &bull; {item.mealType || 'Meal'}
                  </h4>
                  <span className="text-xs text-on-surface-variant whitespace-nowrap">
                    {formatTime(item.createdAt)}
                  </span>
                </div>
                <p className="text-sm font-medium text-primary truncate">ID: {item.studentId}</p>
                {item.reason && (
                  <p className="text-xs text-on-surface-variant mt-1 truncate">{item.reason}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
