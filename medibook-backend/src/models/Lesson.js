import mongoose from 'mongoose'

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a lesson title'],
      trim: true,
      maxlength: [150, 'Lesson title cannot exceed 150 characters']
    },
    content: {
      type: String,
      required: [true, 'Please provide content or description for the lesson']
    },
    videoUrl: {
      type: String,
      default: ''
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Lesson must belong to a course'],
      index: true
    },
    order: {
      type: Number,
      default: 1
    },
    duration: {
      type: Number,
      default: 10, // Duration in minutes
      min: 1
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

// Virtual field for comments on this lesson
lessonSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'lesson',
  justOne: false
})

const Lesson = mongoose.model('Lesson', lessonSchema)
export default Lesson
