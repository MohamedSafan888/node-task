import 'dotenv/config'
import mongoose from 'mongoose'
import User from './models/User.js'
import Course from './models/Course.js'
import Lesson from './models/Lesson.js'
import Enrollment from './models/Enrollment.js'
import Comment from './models/Comment.js'

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/course_platform'
    console.log(`Connecting to MongoDB at: ${mongoUri}`)
    await mongoose.connect(mongoUri)
    console.log('MongoDB connected successfully for seeding.')

    // 1. Clear existing collections
    console.log('Clearing existing data...')
    await Promise.all([
      User.deleteMany({}),
      Course.deleteMany({}),
      Lesson.deleteMany({}),
      Enrollment.deleteMany({}),
      Comment.deleteMany({})
    ])
    console.log('Previous data cleared.')

    // 2. Create Users (Instructors and Students)
    console.log('Creating users...')
    const instructors = await User.create([
      {
        name: 'Dr. Sarah Johnson',
        email: 'sarah@example.com',
        password: 'password123',
        role: 'Instructor',
        bio: 'Senior Software Engineer & Full-stack Instructor with 10+ years experience.',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Prof. Ahmed Ali',
        email: 'ahmed@example.com',
        password: 'password123',
        role: 'Instructor',
        bio: 'Data Scientist and AI specialist, former Lead Architect.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
      }
    ])

    const students = await User.create([
      {
        name: 'Omar Khaled',
        email: 'omar@example.com',
        password: 'password123',
        role: 'Student',
        bio: 'Computer Science student passionate about web technologies.',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Layla Hassan',
        email: 'layla@example.com',
        password: 'password123',
        role: 'Student',
        bio: 'Enthusiastic learner focusing on Data Science and AI.',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Karim Tarek',
        email: 'karim@example.com',
        password: 'password123',
        role: 'Student',
        bio: 'Junior Developer seeking to master modern full-stack development.',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
      }
    ])

    console.log(`Created ${instructors.length} Instructors and ${students.length} Students.`)

    // 3. Create Courses
    console.log('Creating courses...')
    const course1 = await Course.create({
      title: 'Full-Stack React & Node.js Masterclass',
      description: 'Master full-stack web development from scratch using React, Express, Node.js, and MongoDB.',
      instructor: instructors[0]._id,
      category: 'Web Development',
      price: 49.99,
      level: 'All Levels',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=600&q=80',
      ratings: [
        {
          student: students[0]._id,
          rating: 5,
          review: 'One of the best practical courses I have ever taken! Everything is explained clearly.'
        },
        {
          student: students[1]._id,
          rating: 4,
          review: 'Great content and code quality. Highly recommended.'
        }
      ]
    })
    course1.calculateAverageRating()
    await course1.save()

    const course2 = await Course.create({
      title: 'Python for Data Science & Machine Learning',
      description: 'Comprehensive guide to data analysis with Pandas, NumPy, visualization, and Scikit-Learn.',
      instructor: instructors[1]._id,
      category: 'Data Science',
      price: 59.99,
      level: 'Intermediate',
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
      ratings: [
        {
          student: students[1]._id,
          rating: 5,
          review: 'Dr. Ahmed makes complex algorithms so easy to understand!'
        }
      ]
    })
    course2.calculateAverageRating()
    await course2.save()

    const course3 = await Course.create({
      title: 'UI/UX Design Essentials: From Wireframe to Prototype',
      description: 'Learn Figma, user research, wireframing, and interactive design principles.',
      instructor: instructors[0]._id,
      category: 'Design',
      price: 29.99,
      level: 'Beginner',
      thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=600&q=80',
      ratings: []
    })
    course3.calculateAverageRating()
    await course3.save()

    console.log('Courses created successfully.')

    // 4. Create Lessons for Course 1
    console.log('Creating lessons...')
    const lessonsCourse1 = await Lesson.create([
      {
        title: 'Introduction to Modern Full-Stack Architecture',
        content: 'Overview of REST APIs, client-server separation, and environment setup with Node.js.',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        course: course1._id,
        order: 1,
        duration: 15
      },
      {
        title: 'Express Routing & Middleware Fundamentals',
        content: 'How to structure routes, controllers, and custom error handling in Express.',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        course: course1._id,
        order: 2,
        duration: 25
      },
      {
        title: 'MongoDB Schema Design with Mongoose',
        content: 'Designing relational-like schemas, validations, and indexes in MongoDB using Mongoose.',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        course: course1._id,
        order: 3,
        duration: 30
      },
      {
        title: 'JWT Authentication & Role-Based Access Control',
        content: 'Securing API endpoints using JSON Web Tokens and role authorization middlewares.',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        course: course1._id,
        order: 4,
        duration: 35
      }
    ])

    // Lessons for Course 2
    const lessonsCourse2 = await Lesson.create([
      {
        title: 'Python NumPy & Pandas Essentials',
        content: 'Working with arrays, data frames, cleaning datasets, and handling missing values.',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        course: course2._id,
        order: 1,
        duration: 20
      },
      {
        title: 'Data Visualization with Matplotlib & Seaborn',
        content: 'Creating bar charts, scatter plots, correlation heatmaps, and distributions.',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        course: course2._id,
        order: 2,
        duration: 25
      }
    ])

    console.log('Lessons created successfully.')

    // 5. Create Enrollments with Progress
    console.log('Creating enrollments...')
    // Omar enrolled in Course 1 with 2 lessons completed (50% progress)
    await Enrollment.create({
      student: students[0]._id,
      course: course1._id,
      completedLessons: [lessonsCourse1[0]._id, lessonsCourse1[1]._id],
      progress: 50
    })

    // Layla enrolled in Course 1 and Course 2 (100% completed)
    await Enrollment.create({
      student: students[1]._id,
      course: course1._id,
      completedLessons: [
        lessonsCourse1[0]._id,
        lessonsCourse1[1]._id,
        lessonsCourse1[2]._id,
        lessonsCourse1[3]._id
      ],
      progress: 100
    })

    await Enrollment.create({
      student: students[1]._id,
      course: course2._id,
      completedLessons: [lessonsCourse2[0]._id, lessonsCourse2[1]._id],
      progress: 100
    })

    // Karim enrolled in Course 1 with 0% progress
    await Enrollment.create({
      student: students[2]._id,
      course: course1._id,
      completedLessons: [],
      progress: 0
    })

    console.log('Enrollments created successfully.')

    // 6. Create Comments on Lessons
    console.log('Creating comments...')
    await Comment.create([
      {
        student: students[0]._id,
        lesson: lessonsCourse1[2]._id,
        content: 'Can you explain the difference between embedding documents and referencing in Mongoose?'
      },
      {
        student: instructors[0]._id,
        lesson: lessonsCourse1[2]._id,
        content: 'Great question Omar! Embedding is best for 1-to-few bounded relationships, while referencing is ideal for large or unbounded sets.'
      },
      {
        student: students[1]._id,
        lesson: lessonsCourse1[3]._id,
        content: 'The JWT expiration handling was super clean and helped me understand refresh tokens.'
      }
    ])

    console.log('Comments created successfully.')

    console.log('\n=============================================')
    console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!')
    console.log('=============================================')
    console.log('Sample Users created (Password for all: password123):')
    console.log('1. Instructors:')
    console.log('   - Dr. Sarah Johnson : sarah@example.com (Role: Instructor)')
    console.log('   - Prof. Ahmed Ali   : ahmed@example.com (Role: Instructor)')
    console.log('2. Students:')
    console.log('   - Omar Khaled       : omar@example.com  (Role: Student)')
    console.log('   - Layla Hassan      : layla@example.com (Role: Student)')
    console.log('   - Karim Tarek       : karim@example.com (Role: Student)')
    console.log('=============================================\n')

    process.exit(0)
  } catch (error) {
    console.error('Error during database seeding:', error)
    process.exit(1)
  }
}

seedDatabase()
