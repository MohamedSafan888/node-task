import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/course_platform')
    console.log(`MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`)
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`)
    console.error('Make sure MongoDB is installed and running locally on port 27017, or update MONGODB_URI in .env')
    process.exit(1)
  }
}

export default connectDB
