import api from './axiosClient'

export const taskApi = {
  // Get all tasks for logged-in user
  getAll: () => api.get('/tasks'),

  // Get single task
  getById: (id) => api.get(`/tasks/${id}`),

  // Create task
  create: (data) => api.post('/tasks', data),

  // Update task
  update: (id, data) => api.put(`/tasks/${id}`, data),

  // Delete task
  delete: (id) => api.delete(`/tasks/${id}`),

  // Update just status
  updateStatus: (id, status) => api.patch(`/tasks/${id}/status`, { status }),

  // AI: generate description/priority/estimatedTime from title
  aiSuggest: (title) => api.post('/tasks/ai-suggest', { title }),
}
