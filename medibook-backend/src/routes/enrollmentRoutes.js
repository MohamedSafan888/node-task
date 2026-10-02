import express from 'express'
import {
  getMyEnrollments,
  getCourseEnrollmentStatus,
  toggleLessonProgress
} from '../controllers/enrollmentController.js'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()

router.get('/my-courses', protect, authorize('Student'), getMyEnrollments)
router.get('/:courseId/status', protect, getCourseEnrollmentStatus)
router.patch(
  '/:courseId/lessons/:lessonId/toggle',
  protect,
  authorize('Student'),
  toggleLessonProgress
)

export default router
