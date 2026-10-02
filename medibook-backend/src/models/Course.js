import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating between 1 and 5'],
      min: 1,
      max: 5
    },
    review: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
)

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a course title'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide a course description']
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Course must have an instructor']
    },
    category: {
      type: String,
      required: [true, 'Please specify a category for this course'],
      trim: true,
      index: true
    },
    price: {
      type: Number,
      default: 0,
      min: [0, 'Price cannot be negative']
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
      default: 'All Levels'
    },
    thumbnail: {
      type: String,
      default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80'
    },
    ratings: [reviewSchema],
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    ratingsCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

// Virtual field for lessons in the course
courseSchema.virtual('lessons', {
  ref: 'Lesson',
  localField: '_id',
  foreignField: 'course',
  justOne: false
})

// Calculate average rating before saving if ratings modified
courseSchema.methods.calculateAverageRating = function () {
  if (this.ratings.length === 0) {
    this.averageRating = 0
    this.ratingsCount = 0
  } else {
    const sum = this.ratings.reduce((acc, curr) => acc + curr.rating, 0)
    this.averageRating = Number((sum / this.ratings.length).toFixed(1))
    this.ratingsCount = this.ratings.length
  }
}

// Text index for search functionality
courseSchema.index({ title: 'text', description: 'text', category: 'text' })

const Course = mongoose.model('Course', courseSchema)
export default Course
