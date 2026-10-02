export const ROLES = {
  INSTRUCTOR: 'Instructor',
  STUDENT: 'Student'
}

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  COURSES: '/courses',
  COURSE_DETAILS: '/courses/:id',
  LESSON_VIEWER: '/courses/:courseId/learn/:lessonId',
  STUDENT_DASHBOARD: '/student/dashboard',
  INSTRUCTOR_DASHBOARD: '/instructor/dashboard',
  INSTRUCTOR_CREATE_COURSE: '/instructor/courses/new',
  INSTRUCTOR_EDIT_COURSE: '/instructor/courses/:id/edit',
  INSTRUCTOR_COURSE_STUDENTS: '/instructor/courses/:id/students',
  NOT_FOUND: '*'
}

export const DEFAULT_PAGE_SIZE = 9
export const APP_NAME = 'CourseHub'
