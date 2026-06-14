import { useState } from 'react'
import { taskApi } from '../../api/taskApi'
import { getErrorMessage } from '../../utils/helpers'
import { Sparkles, Loader } from 'lucide-react'
import toast from 'react-hot-toast'

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH']
const STATUSES = ['TODO', 'IN_PROGRESS', 'DONE']

const STATUS_LABELS = { TODO: 'To Do', IN_PROGRESS: 'In Progress', DONE: 'Done' }

const defaultForm = {
  title: '',
  description: '',
  priority: 'MEDIUM',
  estimatedTime: '',
  dueDate: '',
  status: 'TODO',
}

export default function TaskForm({ initialData = {}, onSubmit, onCancel, submitLabel = 'Create Task', loading = false }) {
  const [form, setForm] = useState({ ...defaultForm, ...initialData })
  const [aiLoading, setAiLoading] = useState(false)

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleAiSuggest = async () => {
    if (!form.title.trim()) {
      toast.error('Enter a task title first')
      return
    }
    setAiLoading(true)
    try {
      const res = await taskApi.aiSuggest(form.title.trim())
      const { description, priority, estimatedTime } = res.data
      setForm(prev => ({
        ...prev,
        description: description || prev.description,
        priority: priority?.toUpperCase() || prev.priority,
        estimatedTime: estimatedTime || prev.estimatedTime,
      }))
      toast.success('AI suggestions applied!')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setAiLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) { toast.error('Title is required'); return }
    onSubmit({
      ...form,
      dueDate: form.dueDate || null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title + AI */}
      <div>
        <label className="label">Title <span className="text-red-500">*</span></label>
        <div className="flex gap-2">
          <input
            className="input flex-1"
            placeholder="e.g. Implement login page"
            value={form.title}
            onChange={set('title')}
            required
          />
          <button
            type="button"
            onClick={handleAiSuggest}
            disabled={aiLoading || !form.title.trim()}
            title="AI Suggest"
            className="btn bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700 focus:ring-purple-500 active:scale-95 shrink-0 disabled:opacity-50"
          >
            {aiLoading ? <Loader size={15} className="animate-spin" /> : <Sparkles size={15} />}
            <span className="hidden sm:inline">AI Suggest</span>
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-1">Click "AI Suggest" to auto-fill description, priority & time estimate</p>
      </div>

      {/* Description */}
      <div>
        <label className="label">Description</label>
        <textarea
          className="input min-h-[90px] resize-y"
          placeholder="What needs to be done?"
          value={form.description}
          onChange={set('description')}
        />
      </div>

      {/* Priority + Estimated Time */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Priority</label>
          <select className="input" value={form.priority} onChange={set('priority')}>
            {PRIORITIES.map(p => (
              <option key={p} value={p}>{p.charAt(0) + p.slice(1).toLowerCase()}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Estimated Time</label>
          <input
            className="input"
            placeholder="e.g. 2 hours, 3 days"
            value={form.estimatedTime}
            onChange={set('estimatedTime')}
          />
        </div>
      </div>

      {/* Due Date + Status */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Due Date</label>
          <input
            type="date"
            className="input"
            value={form.dueDate || ''}
            onChange={set('dueDate')}
          />
        </div>
        <div>
          <label className="label">Status</label>
          <select className="input" value={form.status} onChange={set('status')}>
            {STATUSES.map(s => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-2">
        {onCancel && (
          <button type="button" className="btn-secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
