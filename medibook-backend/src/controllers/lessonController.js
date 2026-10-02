import Lesson from '../models/Lesson.js'
import Course from '../models/Course.js'
import Comment from '../models/Comment.js'
import Enrollment from '../models/Enrollment.js'

// @desc    Get all lessons for a specific course
// @route   GET /api/courses/:courseId/lessons
// @access  Public
export const getLessonsByCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.courseId)
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      })
    }

    const lessons = await Lesson.find({ course: req.params.courseId }).sort('order')

    res.status(200).json({
      success: true,
      count: lessons.length,
      lessons
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single lesson by ID
// @route   GET /api/lessons/:id
// @access  Public (or Enrolled)
export const getLessonById = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id)
      .populate('course', 'title instructor thumbnail')
      .populate({
        path: 'comments',
        populate: {
          path: 'student',
          select: 'name avatar role'
        },
        options: { sort: { createdAt: -1 } }
      })

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      })
    }

    res.status(200).json({
      success: true,
      lesson
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Create a new lesson in a course
// @route   POST /api/courses/:courseId/lessons
// @access  Private (Course Instructor only)
export const createLesson = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.courseId)
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      })
    }

    // Verify instructor ownership
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to add lessons to this course. Only the course instructor can.'
      })
    }

    const { title, content, videoUrl, order, duration } = req.body

    // If order is not provided, default to next available order number
    let lessonOrder = order
    if (!lessonOrder) {
      const lessonCount = await Lesson.countDocuments({ course: course._id })
      lessonOrder = lessonCount + 1
    }

    const lesson = await Lesson.create({
      title,
      content,
      videoUrl: videoUrl || '',
      order: lessonOrder,
      duration: duration || 10,
      course: course._id
    })

    res.status(201).json({
      success: true,
      message: 'Lesson created successfully',
      lesson
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update a lesson
// @route   PUT /api/lessons/:id
// @access  Private (Course Instructor only)
export const updateLesson = async (req, res, next) => {
  try {
    let lesson = await Lesson.findById(req.params.id)
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      })
    }

    // Verify course instructor ownership
    const course = await Course.findById(lesson.course)
    if (!course || course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this lesson'
      })
    }

    const { title, content, videoUrl, order, duration } = req.body

    lesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      { title, content, videoUrl, order, duration },
      { new: true, runValidators: true }
    )

    res.status(200).json({
      success: true,
      message: 'Lesson updated successfully',
      lesson
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete a lesson
// @route   DELETE /api/lessons/:id
// @access  Private (Course Instructor only)
export const deleteLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id)
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      })
    }

    // Verify course instructor ownership
    const course = await Course.findById(lesson.course)
    if (!course || course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this lesson'
      })
    }

    // Delete comments on this lesson
    await Comment.deleteMany({ lesson: lesson._id })

    // Pull lesson from enrollments completedLessons array
    await Enrollment.updateMany(
      { course: lesson.course },
      { $pull: { completedLessons: lesson._id } }
    )

    // Delete lesson
    await Lesson.findByIdAndDelete(lesson._id)

    // Recalculate progress for enrollments in this course
    const remainingLessonsCount = await Lesson.countDocuments({ course: lesson.course })
    if (remainingLessonsCount > 0) {
      const enrollments = await Enrollment.find({ course: lesson.course })
      for (const en of enrollments) {
        en.progress = Math.round((en.completedLessons.length / remainingLessonsCount) * 100)
        await en.save()
      }
    }

    res.status(200).json({
      success: true,
      message: 'Lesson and related comments deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}
