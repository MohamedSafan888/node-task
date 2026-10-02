import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'
import ProtectedRoute from './ProtectedRoute'
import RoleRoute from './RoleRoute'
import AuthLayout from '../layouts/AuthLayout'
import MainLayout from '../layouts/MainLayout'

// Auth (eager)
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'

// Lazy loaded pages
const CourseList = lazy(() => import('../pages/courses/CourseList'))
const CourseDetail = lazy(() => import('../pages/courses/CourseDetail'))
const LessonViewer = lazy(() => import('../pages/learning/LessonViewer'))
const StudentDashboard = lazy(() => import('../pages/student/StudentDashboard'))
const InstructorDashboard = lazy(() => import('../pages/instructor/InstructorDashboard'))
const CourseEditor = lazy(() => import('../pages/instructor/CourseEditor'))
const CourseStudents = lazy(() => import('../pages/instructor/CourseStudents'))
const Profile = lazy(() => import('../pages/Profile'))
const NotFound = lazy(() => import('../pages/NotFound'))

const Loader = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
    <CircularProgress />
  </Box>
)

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Auth Layout */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Public Course Pages (inside MainLayout with Navbar & Footer) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/courses" replace />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/courses/:id" element={<CourseDetail />} />

          {/* Protected Profile */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Student Dashboard */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute>
                <RoleRoute roles={['Student']}>
                  <StudentDashboard />
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          {/* Instructor Studio & Management */}
          <Route
            path="/instructor/dashboard"
            element={
              <ProtectedRoute>
                <RoleRoute roles={['Instructor']}>
                  <InstructorDashboard />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/courses/:id/edit"
            element={
              <ProtectedRoute>
                <RoleRoute roles={['Instructor']}>
                  <CourseEditor />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/courses/:id/students"
            element={
              <ProtectedRoute>
                <RoleRoute roles={['Instructor']}>
                  <CourseStudents />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Interactive Lesson Learning View */}
        <Route
          path="/courses/:courseId/learn/:lessonId"
          element={
            <ProtectedRoute>
              <MainLayout>
                <LessonViewer />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
