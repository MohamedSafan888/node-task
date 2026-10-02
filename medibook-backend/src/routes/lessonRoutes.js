import express from 'express'
import {
  getLessonsByCourse,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson
} from '../controllers/lessonController.js'
import { protect, authorize } from '../middleware/auth.js'
import commentRoutes from './commentRoutes.js'

// mergeParams: true allows accessing :courseId from parent course router
const router = express.Router({ mergeParams: true })

// Re-route into other resource routers: /api/lessons/:lessonId/comments
router.use('/:lessonId/comments', commentRoutes)

router
  .route('/')
  .get(getLessonsByCourse)
  .post(protect, authorize('Instructor'), createLesson)

router
  .route('/:id')
  .get(getLessonById)
  .put(protect, authorize('Instructor'), updateLesson)
  .delete(protect, authorize('Instructor'), deleteLesson)

export default router
