# 🎓 Online Course Platform - RESTful API

A comprehensive backend API for an online learning platform built with **Node.js**, **Express**, and **MongoDB (Mongoose)** following RESTful design principles and MVC architecture.

---

## 🚀 Features

### 1. Core Requirements
- **Authentication & Authorization**:
  - JWT (JSON Web Tokens) authentication with password hashing using `bcryptjs`.
  - Role-Based Access Control (**Instructor** and **Student**).
- **Course Management**:
  - Instructors can create, edit, and delete their own courses.
  - Cascade deletion: deleting a course cleans up all associated lessons, enrollments, and comments.
- **Lesson Management**:
  - Courses contain ordered lessons with titles, content, video links, and durations.
  - Instructors can add, update, and re-order lessons in their courses.
- **Enrollment System**:
  - Students can enroll in available courses.
  - Prevents duplicate enrollments using a compound unique index (`student` + `course`).
- **Discussion / Comments**:
  - Students and Instructors can comment and ask questions on specific lessons.
  - Comment author or course instructor can moderate/delete comments.

### 2. Suggested Extra Features (All Implemented ✨)
- ⭐ **Course Ratings & Reviews**:
  - Enrolled students can submit a rating (1 to 5 stars) and a written review.
  - Automatically calculates and updates `averageRating` and `ratingsCount`.
- 📊 **Lesson Progress Tracking**:
  - Students can toggle lesson completion status.
  - Dynamic progress calculation percentage (`completedLessons / totalLessons * 100`).
- 🔍 **Search, Filtering, Sorting & Pagination**:
  - Text search on title, description, and category.
  - Filter by category, difficulty level, instructor, and price range.
  - Sorting (by price, rating, date) and pagination (`page`, `limit`).
- 🏷️ **Course Categories**:
  - Dedicated endpoint `/api/courses/categories` returning available categories and total courses per category.

---

## 🗄️ Database Models

1. **`User`**:
   - `name`: String
   - `email`: String (unique, validated format)
   - `password`: String (hashed)
   - `role`: Enum (`'Instructor'`, `'Student'`)
   - `bio`: String
   - `avatar`: String
2. **`Course`**:
   - `title`: String
   - `description`: String
   - `instructor`: Ref -> `User`
   - `category`: String
   - `price`: Number
   - `level`: Enum (`'Beginner'`, `'Intermediate'`, `'Advanced'`, `'All Levels'`)
   - `ratings`: Array of `{ student, rating, review, createdAt }`
   - `averageRating`: Number
   - `ratingsCount`: Number
3. **`Lesson`**:
   - `title`: String
   - `content`: String
   - `videoUrl`: String
   - `course`: Ref -> `Course`
   - `order`: Number
   - `duration`: Number (minutes)
4. **`Enrollment`**:
   - `student`: Ref -> `User`
   - `course`: Ref -> `Course`
   - `completedLessons`: Array of Ref -> `Lesson`
   - `progress`: Number (0 - 100%)
   - `enrolledAt`: Date
5. **`Comment`**:
   - `student`: Ref -> `User`
   - `lesson`: Ref -> `Lesson`
   - `content`: String

---

## ⚙️ Setup & Installation

### 1. Environment Configuration
Ensure your `.env` file exists and has the required values:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/course_platform
JWT_SECRET=super_secret_jwt_key_course_platform_2026
JWT_EXPIRES_IN=7d
CORS_ORIGIN=*
```
*(You can also use a cloud MongoDB Atlas URI if MongoDB is not running locally).*

### 2. Install Dependencies
```bash
npm install
```

### 3. Seed Mock Data
Populate the database with realistic instructors, students, courses, lessons, comments, and enrollments:
```bash
npm run seed
```

### 4. Run the Server
- Development mode (with auto-reload):
  ```bash
  npm run dev
  ```
- Production mode:
  ```bash
  npm start
  ```

Server will run at: `http://localhost:5000`

---

## 🔑 Test Credentials (After Seeding)

| Role | Name | Email | Password |
| :--- | :--- | :--- | :--- |
| **Instructor** | Dr. Sarah Johnson | `sarah@example.com` | `password123` |
| **Instructor** | Prof. Ahmed Ali | `ahmed@example.com` | `password123` |
| **Student** | Omar Khaled | `omar@example.com` | `password123` |
| **Student** | Layla Hassan | `layla@example.com` | `password123` |
| **Student** | Karim Tarek | `karim@example.com` | `password123` |

---

## 📡 API Endpoints Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user (`role`: 'Instructor' or 'Student') |
| `POST` | `/api/auth/login` | Public | Login with email & password, returns JWT token |
| `GET` | `/api/auth/me` | Private | Get profile of logged-in user |
| `PUT` | `/api/auth/update-profile` | Private | Update profile info (name, bio, avatar) |

### 📚 Courses (`/api/courses`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/courses` | Public | List courses (supports `search`, `category`, `level`, `sort`, `page`, `limit`) |
| `GET` | `/api/courses/categories` | Public | Get categories with course counts |
| `GET` | `/api/courses/:id` | Public | Get course details with lessons and reviews |
| `POST` | `/api/courses` | Instructor | Create a new course |
| `PUT` | `/api/courses/:id` | Instructor | Update course (Owner only) |
| `DELETE`| `/api/courses/:id` | Instructor | Delete course + cascade lessons/comments/enrollments |
| `POST` | `/api/courses/:id/rate` | Student | Rate & review an enrolled course (1 - 5 stars) |
| `POST` | `/api/courses/:courseId/enroll` | Student | Enroll in a course |
| `GET` | `/api/courses/:courseId/students` | Instructor | View enrolled students and their progress |

### 📖 Lessons (`/api/lessons` & `/api/courses/:courseId/lessons`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/courses/:courseId/lessons` | Public | Get all lessons for a course ordered by lesson number |
| `POST` | `/api/courses/:courseId/lessons` | Instructor | Add a lesson to course (Owner only) |
| `GET` | `/api/lessons/:id` | Public | Get lesson details by ID (includes comments) |
| `PUT` | `/api/lessons/:id` | Instructor | Update lesson content/video/order (Owner only) |
| `DELETE`| `/api/lessons/:id` | Instructor | Delete lesson and clean up comments/progress |

### 🎓 Enrollments & Progress (`/api/enrollments`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/enrollments/my-courses` | Student | Get all courses enrolled by the logged-in student |
| `GET` | `/api/enrollments/:courseId/status`| Private | Check enrollment status for a course |
| `PATCH`| `/api/enrollments/:courseId/lessons/:lessonId/toggle` | Student | Mark/unmark lesson completed & update progress % |

### 💬 Comments (`/api/comments` & `/api/lessons/:lessonId/comments`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/lessons/:lessonId/comments` | Public | Get all comments for a specific lesson |
| `POST` | `/api/lessons/:lessonId/comments` | Enrolled / Instructor | Post a new comment on a lesson |
| `DELETE`| `/api/comments/:id` | Author / Instructor | Delete comment (by author or course instructor) |

---

## 🧪 Postman / Testing Quick Guide

### 1. Register / Login
**POST** `http://localhost:5000/api/auth/login`
```json
{
  "email": "sarah@example.com",
  "password": "password123"
}
```
Copy the `token` from the response.

### 2. Authenticate Protected Requests
In Postman or Thunder Client:
- Tab: **Authorization**
- Type: **Bearer Token**
- Value: `<paste your token here>`
