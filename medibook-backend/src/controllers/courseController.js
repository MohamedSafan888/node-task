import Course from '../models/Course.js'
import Lesson from '../models/Lesson.js'
import Enrollment from '../models/Enrollment.js'
import Comment from '../models/Comment.js'

// @desc    Get all courses with search, filtering, sorting, pagination
// @route   GET /api/courses
// @access  Public
export const getCourses = async (req, res, next) => {
  try {
    const { search, category, instructor, level, minPrice, maxPrice, sort, page = 1, limit = 10 } = req.query

    const query = {}

    // Search query on title and description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ]
    }

    // Category filter
    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') }
    }

    // Level filter
    if (level) {
      query.level = level
    }

    // Instructor filter
    if (instructor) {
      query.instructor = instructor
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {}
      if (minPrice !== undefined) query.price.$gte = Number(minPrice)
      if (maxPrice !== undefined) query.price.$lte = Number(maxPrice)
    }

    // Sorting
    let sortBy = '-createdAt'
    if (sort) {
      sortBy = sort.split(',').join(' ')
    }

    // Pagination
    const pageNum = parseInt(page, 10) || 1
    const limitNum = parseInt(limit, 10) || 10
    const skip = (pageNum - 1) * limitNum

    const total = await Course.countDocuments(query)
    const courses = await Course.find(query)
      .populate('instructor', 'name email avatar bio')
      .sort(sortBy)
      .skip(skip)
      .limit(limitNum)

    res.status(200).json({
      success: true,
      count: courses.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      courses
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get distinct course categories and course counts
// @route   GET /api/courses/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Course.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          count: 1
        }
      },
      { $sort: { count: -1 } }
    ])

    res.status(200).json({
      success: true,
      categories
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single course by ID (with lessons and instructor)
// @route   GET /api/courses/:id
// @access  Public
export const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email avatar bio')
      .populate({
        path: 'lessons',
        options: { sort: { order: 1 } },
        select: 'title content videoUrl duration order createdAt'
      })
      .populate('ratings.student', 'name avatar')

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      })
    }

    res.status(200).json({
      success: true,
      course
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private (Instructor only)
export const createCourse = async (req, res, next) => {
  try {
    const { title, description, category, price, level, thumbnail } = req.body

    const course = await Course.create({
      title,
      description,
      category,
      price: price || 0,
      level: level || 'All Levels',
      thumbnail,
      instructor: req.user._id
    })

    const populatedCourse = await Course.findById(course._id).populate(
      'instructor',
      'name email avatar bio'
    )

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      course: populatedCourse
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Course Instructor only)
export const updateCourse = async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id)

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      })
    }

    // Verify ownership: req.user must be the course instructor
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this course. Only the creator can edit it.'
      })
    }

    const { title, description, category, price, level, thumbnail } = req.body

    course = await Course.findByIdAndUpdate(
      req.params.id,
      { title, description, category, price, level, thumbnail },
      { new: true, runValidators: true }
    ).populate('instructor', 'name email avatar')

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      course
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete course and its cascade items (lessons, enrollments, comments)
// @route   DELETE /api/courses/:id
// @access  Private (Course Instructor only)
export const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      })
    }

    // Verify ownership
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this course'
      })
    }

    // Find all lessons for this course to clean up their comments
    const lessons = await Lesson.find({ course: course._id })
    const lessonIds = lessons.map(l => l._id)

    // Cascade delete: Comments on these lessons
    await Comment.deleteMany({ lesson: { $in: lessonIds } })

    // Cascade delete: Lessons
    await Lesson.deleteMany({ course: course._id })

    // Cascade delete: Enrollments for this course
    await Enrollment.deleteMany({ course: course._id })

    // Delete course
    await Course.findByIdAndDelete(course._id)

    res.status(200).json({
      success: true,
      message: 'Course and all associated lessons, enrollments, and comments deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Rate and review a course
// @route   POST /api/courses/:id/rate
// @access  Private (Student only)
export const rateCourse = async (req, res, next) => {
  try {
    const { rating, review } = req.body
    const numericRating = Number(rating)

    if (!numericRating || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid rating number between 1 and 5'
      })
    }

    const course = await Course.findById(req.params.id)
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      })
    }

    // Verify student is enrolled in this course
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: course._id
    })

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You must be enrolled in this course to leave a rating and review'
      })
    }

    // Check if user already reviewed
    const existingIndex = course.ratings.findIndex(
      r => r.student.toString() === req.user._id.toString()
    )

    if (existingIndex > -1) {
      course.ratings[existingIndex].rating = numericRating
      course.ratings[existingIndex].review = review || course.ratings[existingIndex].review
      course.ratings[existingIndex].createdAt = new Date()
    } else {
      course.ratings.push({
        student: req.user._id,
        rating: numericRating,
        review: review || ''
      })
    }

    course.calculateAverageRating()
    await course.save()

    res.status(200).json({
      success: true,
      message: 'Course rated successfully',
      averageRating: course.averageRating,
      ratingsCount: course.ratingsCount,
      ratings: course.ratings
    })
  } catch (error) {
    next(error)
  }
}
