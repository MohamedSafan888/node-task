import api from './api'

export const lessonService = {
  getLessons: async (courseId) => {
    const { data } = await api.get(`/courses/${courseId}/lessons`)
    return data.lessons
  },
  getLessonById: async (lessonId) => {
    const { data } = await api.get(`/lessons/${lessonId}`)
    return data.lesson
  },
  createLesson: async (courseId, payload) => {
    const { data } = await api.post(`/courses/${courseId}/lessons`, payload)
    return data.lesson
  },
  updateLesson: async (lessonId, payload) => {
    const { data } = await api.put(`/lessons/${lessonId}`, payload)
    return data.lesson
  },
  deleteLesson: async (lessonId) => {
    const { data } = await api.delete(`/lessons/${lessonId}`)
    return data
  },
  getComments: async (lessonId) => {
    const { data } = await api.get(`/lessons/${lessonId}/comments`)
    return data.comments
  },
  addComment: async (lessonId, content) => {
    const { data } = await api.post(`/lessons/${lessonId}/comments`, { content })
    return data.comment
  },
  deleteComment: async (commentId) => {
    const { data } = await api.delete(`/comments/${commentId}`)
    return data
  }
}
