import { useState, useEffect, useCallback } from 'react'
import { taskApi } from '../api/taskApi'
import toast from 'react-hot-toast'

export function useTasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await taskApi.getAll()
      setTasks(res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchTasks() }, [fetchTasks])

  const createTask = useCallback(async (data) => {
    const res = await taskApi.create(data)
    setTasks(prev => [res.data, ...prev])
    toast.success('Task created!')
    return res.data
  }, [])

  const updateTask = useCallback(async (id, data) => {
    const res = await taskApi.update(id, data)
    setTasks(prev => prev.map(t => t.id === id ? res.data : t))
    toast.success('Task updated!')
    return res.data
  }, [])

  const deleteTask = useCallback(async (id) => {
    await taskApi.delete(id)
    setTasks(prev => prev.filter(t => t.id !== id))
    toast.success('Task deleted')
  }, [])

  const updateStatus = useCallback(async (id, status) => {
    const res = await taskApi.updateStatus(id, status)
    setTasks(prev => prev.map(t => t.id === id ? res.data : t))
  }, [])

  return { tasks, loading, error, fetchTasks, createTask, updateTask, deleteTask, updateStatus }
}
