import express from 'express'
import {
  getCommentsByLesson,
  addComment,
  deleteComment
} from '../controllers/commentController.js'
import { protect } from '../middleware/auth.js'

// mergeParams: true allows accessing :lessonId from parent router
const router = express.Router({ mergeParams: true })

router
  .route('/')
  .get(getCommentsByLesson)
  .post(protect, addComment)

router.route('/:id').delete(protect, deleteComment)

export default router
