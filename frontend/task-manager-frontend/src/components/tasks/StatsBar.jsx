import { CheckCircle2, Circle, Loader2, ListTodo } from 'lucide-react'

export default function StatsBar({ tasks }) {
  const total = tasks.length
  const todo = tasks.filter(t => t.status === 'TODO').length
  const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length
  const done = tasks.filter(t => t.status === 'DONE').length
  const percent = total > 0 ? Math.round((done / total) * 100) : 0

  const stats = [
    { label: 'Total', value: total, icon: ListTodo, color: 'text-slate-600', bg: 'bg-slate-100' },
    { label: 'To Do', value: todo, icon: Circle, color: 'text-slate-500', bg: 'bg-slate-50' },
    { label: 'In Progress', value: inProgress, icon: Loader2, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Done', value: done, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {stats.map(({ label, value, icon: Icon, color, bg }) => (
        <div key={label} className={`card p-4 flex items-center gap-3`}>
          <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
            <Icon size={18} className={color} />
          </div>
          <div>
            <p className="text-xl font-bold text-slate-800 leading-none">{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </div>
        </div>
      ))}

      {/* Progress bar — full width on mobile, in grid it'll be placed by CSS */}
      {total > 0 && (
        <div className="col-span-2 sm:col-span-4 card p-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-slate-600">Overall Progress</span>
            <span className="text-xs font-bold text-primary-700">{percent}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div
              className="bg-primary-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
