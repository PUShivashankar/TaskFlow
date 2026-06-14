import { Search, X } from 'lucide-react'

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'TODO', label: 'To Do' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'DONE', label: 'Done' },
]

const PRIORITY_OPTIONS = [
  { value: '', label: 'All Priority' },
  { value: 'HIGH', label: '🔴 High' },
  { value: 'MEDIUM', label: '🟡 Medium' },
  { value: 'LOW', label: '🟢 Low' },
]

export default function TaskFilters({ filters, onChange }) {
  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value })
  const hasActive = filters.search || filters.status || filters.priority

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Search */}
      <div className="relative flex-1 min-w-[180px]">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          className="input pl-8 pr-8"
          placeholder="Search tasks..."
          value={filters.search}
          onChange={set('search')}
        />
        {filters.search && (
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            onClick={() => onChange({ ...filters, search: '' })}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Status filter */}
      <select className="input w-auto" value={filters.status} onChange={set('status')}>
        {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>

      {/* Priority filter */}
      <select className="input w-auto" value={filters.priority} onChange={set('priority')}>
        {PRIORITY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>

      {/* Clear filters */}
      {hasActive && (
        <button
          className="btn-ghost text-slate-500 text-sm"
          onClick={() => onChange({ search: '', status: '', priority: '' })}
        >
          <X size={14} /> Clear
        </button>
      )}
    </div>
  )
}
