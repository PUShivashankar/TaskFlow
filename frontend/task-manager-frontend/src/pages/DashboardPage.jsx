import { useState, useMemo } from 'react'
import { Plus } from 'lucide-react'
import { useTasks } from '../hooks/useTasks'
import { getErrorMessage } from '../utils/helpers'
import AppLayout from '../components/layout/AppLayout'
import StatsBar from '../components/tasks/StatsBar'
import TaskCard from '../components/tasks/TaskCard'
import TaskFilters from '../components/tasks/TaskFilters'
import TaskForm from '../components/tasks/TaskForm'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import EmptyState from '../components/ui/EmptyState'
import Spinner from '../components/ui/Spinner'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const { tasks, loading, error, createTask, updateTask, deleteTask, updateStatus } = useTasks()

  const [filters, setFilters] = useState({ search: '', status: '', priority: '' })
  const [showCreate, setShowCreate] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Filtered + sorted tasks
  const filtered = useMemo(() => {
    let list = [...tasks]
    if (filters.search) {
      const q = filters.search.toLowerCase()
      list = list.filter(t =>
        t.title?.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q)
      )
    }
    if (filters.status) list = list.filter(t => t.status === filters.status)
    if (filters.priority) list = list.filter(t => t.priority?.toUpperCase() === filters.priority)

    // Sort: TODO → IN_PROGRESS → DONE, then by createdAt desc
    const statusOrder = { TODO: 0, IN_PROGRESS: 1, DONE: 2 }
    list.sort((a, b) => {
      const sd = (statusOrder[a.status] ?? 0) - (statusOrder[b.status] ?? 0)
      if (sd !== 0) return sd
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
    return list
  }, [tasks, filters])

  const handleCreate = async (data) => {
    setSaving(true)
    try {
      await createTask(data)
      setShowCreate(false)
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async (data) => {
    setSaving(true)
    try {
      await updateTask(editTask.id, data)
      setEditTask(null)
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteTask(deleteTarget.id)
      setDeleteTarget(null)
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setDeleting(false)
    }
  }

  const handleStatusChange = async (id, status) => {
    try {
      await updateStatus(id, status)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Tasks</h1>
          <p className="text-sm text-slate-500 mt-0.5">{tasks.length} task{tasks.length !== 1 ? 's' : ''} total</p>
        </div>
        <button className="btn-primary" onClick={() => setShowCreate(true)}>
          <Plus size={16} />
          New Task
        </button>
      </div>

      {/* Stats */}
      {tasks.length > 0 && <StatsBar tasks={tasks} />}

      {/* Filters */}
      {tasks.length > 0 && (
        <div className="mb-5">
          <TaskFilters filters={filters} onChange={setFilters} />
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <div className="card p-8 text-center">
          <p className="text-red-500 font-medium mb-2">Failed to load tasks</p>
          <p className="text-sm text-slate-500">{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title={tasks.length === 0 ? 'No tasks yet' : 'No matching tasks'}
          description={tasks.length === 0
            ? 'Create your first task to get started. Use AI Suggest to auto-fill details!'
            : 'Try adjusting your filters.'
          }
          action={tasks.length === 0 && (
            <button className="btn-primary" onClick={() => setShowCreate(true)}>
              <Plus size={16} /> Create Task
            </button>
          )}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={setEditTask}
              onDelete={setDeleteTarget}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create New Task" size="lg">
        <TaskForm
          onSubmit={handleCreate}
          onCancel={() => setShowCreate(false)}
          loading={saving}
          submitLabel="Create Task"
        />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editTask} onClose={() => setEditTask(null)} title="Edit Task" size="lg">
        {editTask && (
          <TaskForm
            initialData={{
              ...editTask,
              dueDate: editTask.dueDate || '',
            }}
            onSubmit={handleUpdate}
            onCancel={() => setEditTask(null)}
            loading={saving}
            submitLabel="Save Changes"
          />
        )}
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        loading={deleting}
      />
    </AppLayout>
  )
}
