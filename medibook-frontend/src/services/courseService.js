import api from './api'

export const courseService = {
  getCourses: async (params = {}) => {
    const { data } = await api.get('/courses', { params })
    return data
  },
  getCategories: async () => {
    const { data } = await api.get('/courses/categories')
    return data.categories
  },
  getCourseById: async (id) => {
    const { data } = await api.get(`/courses/${id}`)
    return data.course
  },
  createCourse: async (payload) => {
    const { data } = await api.post('/courses', payload)
    return data.course
  },
  updateCourse: async (id, payload) => {
    const { data } = await api.put(`/courses/${id}`, payload)
    return data.course
  },
  deleteCourse: async (id) => {
    const { data } = await api.delete(`/courses/${id}`)
    return data
  },
  rateCourse: async (id, { rating, review }) => {
    const { data } = await api.post(`/courses/${id}/rate`, { rating, review })
    return data
  },
  enrollInCourse: async (courseId) => {
    const { data } = await api.post(`/courses/${courseId}/enroll`)
    return data.enrollment
  },
  getCourseStudents: async (courseId) => {
    const { data } = await api.get(`/courses/${courseId}/students`)
    return data.students
  }
}
