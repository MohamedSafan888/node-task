import Enrollment from '../models/Enrollment.js'
import Course from '../models/Course.js'
import Lesson from '../models/Lesson.js'

// @desc    Enroll in a course
// @route   POST /api/courses/:courseId/enroll
// @access  Private (Student only)
export const enrollInCourse = async (req, res, next) => {
  try {
    const courseId = req.params.courseId

    // Check if course exists
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      })
    }

    // Check if user is already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId
    })

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this course'
      })
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      student: req.user._id,
      course: courseId,
      progress: 0,
      completedLessons: []
    })

    const populatedEnrollment = await Enrollment.findById(enrollment._id).populate({
      path: 'course',
      select: 'title category thumbnail level instructor',
      populate: { path: 'instructor', select: 'name email' }
    })

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in course',
      enrollment: populatedEnrollment
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all courses enrolled by the current logged-in student
// @route   GET /api/enrollments/my-courses
// @access  Private (Student only)
export const getMyEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate({
        path: 'course',
        select: 'title description category level thumbnail averageRating ratingsCount instructor',
        populate: { path: 'instructor', select: 'name avatar' }
      })
      .populate('completedLessons', 'title order')
      .sort('-enrolledAt')

    res.status(200).json({
      success: true,
      count: enrollments.length,
      enrollments
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Check enrollment status for a specific course
// @route   GET /api/enrollments/:courseId/status
// @access  Private
export const getCourseEnrollmentStatus = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: req.params.courseId
    }).populate('completedLessons', 'title order')

    if (!enrollment) {
      return res.status(200).json({
        success: true,
        isEnrolled: false,
        enrollment: null
      })
    }

    res.status(200).json({
      success: true,
      isEnrolled: true,
      enrollment
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Toggle lesson completion / track progress
// @route   PATCH /api/enrollments/:courseId/lessons/:lessonId/toggle
// @access  Private (Student only)
export const toggleLessonProgress = async (req, res, next) => {
  try {
    const { courseId, lessonId } = req.params

    // Find enrollment
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId
    })

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You are not enrolled in this course'
      })
    }

    // Verify lesson belongs to this course
    const lesson = await Lesson.findOne({ _id: lessonId, course: courseId })
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found in this course'
      })
    }

    // Check if lesson is already marked as completed
    const lessonIndex = enrollment.completedLessons.indexOf(lessonId)
    let isCompleted = false

    if (lessonIndex > -1) {
      // Unmark lesson
      enrollment.completedLessons.splice(lessonIndex, 1)
      isCompleted = false
    } else {
      // Mark lesson as completed
      enrollment.completedLessons.push(lessonId)
      isCompleted = true
    }

    // Recalculate progress percentage
    const totalLessons = await Lesson.countDocuments({ course: courseId })
    enrollment.progress =
      totalLessons > 0
        ? Math.round((enrollment.completedLessons.length / totalLessons) * 100)
        : 0

    await enrollment.save()

    res.status(200).json({
      success: true,
      message: isCompleted
        ? 'Lesson marked as completed'
        : 'Lesson marked as incomplete',
      progress: enrollment.progress,
      completedLessons: enrollment.completedLessons
    })
  } catch (error)
  {
    next(error)
  }
}

// @desc    Get all students enrolled in a course (for instructor)
// @route   GET /api/courses/:courseId/students
// @access  Private (Course Instructor only)
export const getCourseStudents = async (req, res, next) => {
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
        message: 'You are not authorized to view students of this course'
      })
    }

    const enrollments = await Enrollment.find({ course: course._id })
      .populate('student', 'name email avatar')
      .sort('-enrolledAt')

    res.status(200).json({
      success: true,
      count: enrollments.length,
      students: enrollments.map(e => ({
        enrollmentId: e._id,
        student: e.student,
        progress: e.progress,
        completedLessonsCount: e.completedLessons.length,
        enrolledAt: e.enrolledAt
      }))
    })
  } catch (error) {
    next(error)
  }
}
