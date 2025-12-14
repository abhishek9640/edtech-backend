# 🎓 EdTech Platform Backend API

A robust RESTful API for an educational technology platform built with **Node.js**, **Express**, **TypeScript**, and **MongoDB**.

## 🌐 Live Demo

- **API Base URL:** https://edtech-backend-ry6i.onrender.com
- **Health Check:** https://edtech-backend-ry6i.onrender.com/health

## ✨ Features

- **Authentication & Authorization**
  - JWT-based authentication with access & refresh tokens
  - Role-based access control (Student, Instructor, Admin)
  - Secure password hashing with bcrypt

- **Course Management**
  - CRUD operations for courses
  - Course categories, levels, and tags
  - Course publishing workflow (draft → published → archived)
  - Course reviews and ratings

- **Lesson Management**
  - Create and organize lessons within courses
  - Video content and resource attachments
  - Lesson ordering and duration tracking

- **Enrollment System**
  - Course enrollment and unenrollment
  - Progress tracking per lesson
  - Completion certificates

- **Security**
  - Helmet.js for HTTP security headers
  - Rate limiting to prevent abuse
  - CORS configuration for cross-origin requests
  - Input validation with express-validator

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Runtime | Node.js |
| Framework | Express.js |
| Language | TypeScript |
| Database | MongoDB + Mongoose |
| Authentication | JWT (jsonwebtoken) |
| Security | Helmet, bcryptjs, express-rate-limit |
| Validation | express-validator |
| Logging | Morgan |

## 📁 Project Structure

```
src/
├── config/          # Database and environment configuration
├── controllers/     # Request handlers
├── middlewares/     # Auth, error handling, role checking
├── models/          # Mongoose schemas
├── routes/          # API route definitions
├── types/           # TypeScript type definitions
├── utils/           # Helper functions (JWT, etc.)
└── server.ts        # Application entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- MongoDB database (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/edtech-backend.git
   cd edtech-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/edtech
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   JWT_REFRESH_SECRET=your-refresh-secret-key
   JWT_REFRESH_EXPIRE=30d
   CLIENT_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## 📚 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register a new user |
| POST | `/api/v1/auth/login` | Login user |
| GET | `/api/v1/auth/me` | Get current user |

### Courses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/courses` | Get all courses |
| GET | `/api/v1/courses/:id` | Get course by ID |
| POST | `/api/v1/courses` | Create course (Instructor) |
| PUT | `/api/v1/courses/:id` | Update course |
| DELETE | `/api/v1/courses/:id` | Delete course |
| PATCH | `/api/v1/courses/:id/publish` | Toggle publish status |
| POST | `/api/v1/courses/:id/reviews` | Add review |

### Lessons
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/lessons/courses/:courseId/lessons` | Get course lessons |
| GET | `/api/v1/lessons/:id` | Get lesson by ID |
| POST | `/api/v1/lessons/courses/:courseId/lessons` | Create lesson |
| PUT | `/api/v1/lessons/:id` | Update lesson |
| DELETE | `/api/v1/lessons/:id` | Delete lesson |

### Enrollments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/enrollments/:courseId/enroll` | Enroll in course |
| GET | `/api/v1/enrollments/my-enrollments` | Get user enrollments |
| POST | `/api/v1/enrollments/:courseId/lessons/:lessonId/complete` | Mark lesson complete |
| DELETE | `/api/v1/enrollments/:courseId/unenroll` | Unenroll from course |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/users/:id` | Get user profile |
| PUT | `/api/v1/users/profile` | Update profile |
| GET | `/api/v1/users` | Get all users (Admin) |
| DELETE | `/api/v1/users/:id` | Delete user (Admin) |

## 🧪 Testing with Postman

Import the included `postmanCollection.json` file into Postman for a complete API testing suite with pre-configured requests and automatic token handling.

## 🚢 Deployment

### Render

This project includes a `render.yaml` for easy deployment to Render:

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Render will automatically detect the `render.yaml` configuration
4. Add your environment variables in the Render dashboard

### Environment Variables for Production

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | Set to `production` |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `JWT_REFRESH_SECRET` | Secret key for refresh tokens |
| `CLIENT_URL` | Frontend URL (no trailing slash) |

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Vivek Kumar**

---

Made with ❤️ for education
