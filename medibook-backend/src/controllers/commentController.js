import Comment from '../models/Comment.js'
import Lesson from '../models/Lesson.js'
import Course from '../models/Course.js'
import Enrollment from '../models/Enrollment.js'

// @desc    Get comments for a specific lesson
// @route   GET /api/lessons/:lessonId/comments
// @access  Public (or Enrolled)
export const getCommentsByLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId)
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      })
    }

    const comments = await Comment.find({ lesson: req.params.lessonId })
      .populate('student', 'name avatar role')
      .sort('-createdAt')

    res.status(200).json({
      success: true,
      count: comments.length,
      comments
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Add a comment to a lesson
// @route   POST /api/lessons/:lessonId/comments
// @access  Private (Student or Instructor)
export const addComment = async (req, res, next) => {
  try {
    const { content } = req.body
    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Comment content cannot be empty'
      })
    }

    const lesson = await Lesson.findById(req.params.lessonId)
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      })
    }

    // Check if user is enrolled student OR the course instructor
    const course = await Course.findById(lesson.course)
    const isInstructor = course && course.instructor.toString() === req.user._id.toString()

    if (!isInstructor && req.user.role === 'Student') {
      const isEnrolled = await Enrollment.findOne({
        student: req.user._id,
        course: lesson.course
      })

      if (!isEnrolled) {
        return res.status(403).json({
          success: false,
          message: 'You must be enrolled in the course to comment on its lessons'
        })
      }
    }

    const comment = await Comment.create({
      student: req.user._id,
      lesson: lesson._id,
      content: content.trim()
    })

    const populatedComment = await Comment.findById(comment._id).populate(
      'student',
      'name avatar role'
    )

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      comment: populatedComment
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private (Author or Course Instructor)
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id)
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      })
    }

    const lesson = await Lesson.findById(comment.lesson)
    const course = lesson ? await Course.findById(lesson.course) : null

    const isAuthor = comment.student.toString() === req.user._id.toString()
    const isCourseInstructor = course && course.instructor.toString() === req.user._id.toString()

    if (!isAuthor && !isCourseInstructor) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this comment'
      })
    }

    await Comment.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}
