import express from 'express'
import {
  getCourses,
  getCategories,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  rateCourse
} from '../controllers/courseController.js'
import {
  enrollInCourse,
  getCourseStudents
} from '../controllers/enrollmentController.js'
import { protect, authorize } from '../middleware/auth.js'
import lessonRoutes from './lessonRoutes.js'

const router = express.Router()

// Re-route into lesson router: /api/courses/:courseId/lessons
router.use('/:courseId/lessons', lessonRoutes)

// Categories endpoint
router.get('/categories', getCategories)

// Main course endpoints
router
  .route('/')
  .get(getCourses)
  .post(protect, authorize('Instructor'), createCourse)

router
  .route('/:id')
  .get(getCourseById)
  .put(protect, authorize('Instructor'), updateCourse)
  .delete(protect, authorize('Instructor'), deleteCourse)

// Course rating by student
router.post('/:id/rate', protect, authorize('Student'), rateCourse)

// Student enroll in course
router.post('/:courseId/enroll', protect, authorize('Student'), enrollInCourse)

// Instructor views enrolled students
router.get('/:courseId/students', protect, authorize('Instructor'), getCourseStudents)

export default router
