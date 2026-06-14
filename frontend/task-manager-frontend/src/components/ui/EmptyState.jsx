import { ClipboardList } from 'lucide-react'

export default function EmptyState({ title = 'No tasks yet', description = 'Create your first task to get started.', action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mb-4">
        <ClipboardList size={28} className="text-primary-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-700 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 mb-6 max-w-xs">{description}</p>
      {action}
    </div>
  )
}
