import api from './api'

export const enrollmentService = {
  getMyEnrollments: async () => {
    const { data } = await api.get('/enrollments/my-courses')
    return data.enrollments
  },
  getCourseStatus: async (courseId) => {
    const { data } = await api.get(`/enrollments/${courseId}/status`)
    return data
  },
  toggleLessonProgress: async (courseId, lessonId) => {
    const { data } = await api.patch(`/enrollments/${courseId}/lessons/${lessonId}/toggle`)
    return data
  }
}
