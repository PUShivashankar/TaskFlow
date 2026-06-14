import { useState } from 'react'
import { Calendar, Clock, Pencil, Trash2, ChevronDown } from 'lucide-react'
import StatusBadge from '../ui/StatusBadge'
import PriorityBadge from '../ui/PriorityBadge'
import { formatDate, isDueSoon, isOverdue } from '../../utils/helpers'

const NEXT_STATUS = { TODO: 'IN_PROGRESS', IN_PROGRESS: 'DONE', DONE: 'TODO' }
const NEXT_LABEL = { TODO: 'Start', IN_PROGRESS: 'Complete', DONE: 'Reopen' }

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const [expanded, setExpanded] = useState(false)
  const dueSoon = isDueSoon(task.dueDate)
  const overdue = task.status !== 'DONE' && isOverdue(task.dueDate)

  return (
    <div className={`card p-4 hover:shadow-md transition-shadow animate-fade-in
      ${task.status === 'DONE' ? 'opacity-75' : ''}
      ${overdue ? 'border-red-200' : ''}`}
    >
      <div className="flex items-start gap-3">
        {/* Status quick-toggle dot */}
        <button
          onClick={() => onStatusChange(task.id, NEXT_STATUS[task.status])}
          title={`Mark as ${NEXT_LABEL[task.status]}`}
          className={`mt-1 w-4 h-4 rounded-full border-2 shrink-0 transition-colors
            ${task.status === 'DONE'
              ? 'bg-green-500 border-green-500'
              : task.status === 'IN_PROGRESS'
              ? 'border-blue-400 bg-blue-100'
              : 'border-slate-300 hover:border-primary-400'}`}
        />

        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className={`font-semibold text-slate-800 leading-snug truncate
            ${task.status === 'DONE' ? 'line-through text-slate-400' : ''}`}
          >
            {task.title}
          </h3>

          {/* Badges */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            <StatusBadge status={task.status} />
            {task.priority && <PriorityBadge priority={task.priority} />}
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-500">
            {task.dueDate && (
              <span className={`flex items-center gap-1 ${overdue ? 'text-red-500 font-medium' : dueSoon ? 'text-orange-500' : ''}`}>
                <Calendar size={11} />
                {overdue ? 'Overdue · ' : dueSoon ? 'Due soon · ' : ''}{formatDate(task.dueDate)}
              </span>
            )}
            {task.estimatedTime && (
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {task.estimatedTime}
              </span>
            )}
          </div>

          {/* Expandable description */}
          {task.description && (
            <div className="mt-2">
              <button
                onClick={() => setExpanded(v => !v)}
                className="text-xs text-primary-600 flex items-center gap-0.5 hover:underline"
              >
                {expanded ? 'Hide' : 'Show'} details
                <ChevronDown size={12} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
              </button>
              {expanded && (
                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{task.description}</p>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-1 shrink-0">
          <button onClick={() => onEdit(task)} className="btn-ghost p-1.5" title="Edit">
            <Pencil size={14} className="text-slate-400 hover:text-primary-600" />
          </button>
          <button onClick={() => onDelete(task)} className="btn-ghost p-1.5" title="Delete">
            <Trash2 size={14} className="text-slate-400 hover:text-red-500" />
          </button>
        </div>
      </div>
    </div>
  )
}
