export const STATUS_CONFIG = {
  TODO: {
    label: 'To Do',
    color: 'bg-slate-100 text-slate-700',
    dot: 'bg-slate-400',
    border: 'border-slate-200',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    color: 'bg-blue-100 text-blue-700',
    dot: 'bg-blue-500',
    border: 'border-blue-200',
  },
  DONE: {
    label: 'Done',
    color: 'bg-green-100 text-green-700',
    dot: 'bg-green-500',
    border: 'border-green-200',
  },
}

export const PRIORITY_CONFIG = {
  HIGH: { label: 'High', color: 'bg-red-100 text-red-700', icon: '🔴' },
  MEDIUM: { label: 'Medium', color: 'bg-yellow-100 text-yellow-700', icon: '🟡' },
  LOW: { label: 'Low', color: 'bg-green-100 text-green-700', icon: '🟢' },
}

export function getPriorityConfig(priority) {
  return PRIORITY_CONFIG[priority?.toUpperCase()] || { label: priority || '—', color: 'bg-slate-100 text-slate-600', icon: '' }
}

export function getStatusConfig(status) {
  return STATUS_CONFIG[status] || STATUS_CONFIG.TODO
}

export function formatDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function isDueSoon(dateStr) {
  if (!dateStr) return false
  const due = new Date(dateStr)
  const now = new Date()
  const diffDays = (due - now) / (1000 * 60 * 60 * 24)
  return diffDays >= 0 && diffDays <= 2
}

export function isOverdue(dateStr) {
  if (!dateStr) return false
  return new Date(dateStr) < new Date()
}

export function getErrorMessage(err) {
  return err?.response?.data?.message || err?.response?.data || err?.message || 'Something went wrong'
}
