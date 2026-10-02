import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import courseRoutes from './routes/courseRoutes.js'
import lessonRoutes from './routes/lessonRoutes.js'
import enrollmentRoutes from './routes/enrollmentRoutes.js'
import commentRoutes from './routes/commentRoutes.js'
import errorHandler from './middleware/errorHandler.js'

// Connect to MongoDB
connectDB()

const app = express()

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }))
app.use(express.json())

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the Online Course Platform API!',
    status: 'Running',
    availableEndpoints: {
      health: '/api/health',
      courses: '/api/courses',
      categories: '/api/courses/categories',
      auth: '/api/auth (register, login, me)',
      enrollments: '/api/enrollments/my-courses',
      lessons: '/api/courses/:courseId/lessons'
    }
  })
})

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Online Course Platform API',
    timestamp: new Date().toISOString()
  })
})

// Mount API routes
app.use('/api/auth', authRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/lessons', lessonRoutes)
app.use('/api/enrollments', enrollmentRoutes)
app.use('/api/comments', commentRoutes)

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Resource not found at ${req.originalUrl}`
  })
})

// Central error handler
app.use(errorHandler)

const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`)
  server.close(() => process.exit(1))
})

export default app
