# Blog Backend API

A modern, production-ready blog API built with Node.js, TypeScript, and PostgreSQL. Features JWT authentication, CRUD operations, and RESTful design principles.

## 🚀 Features

- **Authentication & Authorization** - JWT-based user authentication with protected routes
- **Blog Post Management** - Full CRUD operations for blog posts
- **User Management** - User registration, login, and profile management
- **Database Relationships** - Proper foreign key relationships between users and posts
- **Pagination** - Efficient data loading with customizable page sizes
- **Input Validation** - Comprehensive request validation and error handling
- **TypeScript** - Full type safety and modern JavaScript features
- **Security** - Password hashing with bcrypt, secure JWT implementation

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JSON Web Tokens (JWT)
- **Password Hashing:** bcrypt
- **Validation:** Custom middleware

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

## ⚡ Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/your-username/blog-backend-api.git
cd blog-backend-api
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment setup
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/blog_db"
JWT_SECRET="your-super-secret-jwt-key-here"
PORT=3000
NODE_ENV=development
```

### 4. Database setup
```bash
# Create database
createdb blog_db

# Run migrations
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate
```

### 5. Start the server
```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

The API will be available at `http://localhost:3000`

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | ❌ |
| POST | `/auth/login` | Login user | ❌ |
| GET | `/auth/me` | Get current user info | ✅ |

### Blog Post Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/posts` | Get all published posts | ❌ |
| GET | `/posts/:id` | Get single post by ID | ❌ |
| POST | `/posts` | Create new post | ✅ |
| PUT | `/posts/:id` | Update post (owner only) | ✅ |
| DELETE | `/posts/:id` | Delete post (owner only) | ✅ |
| GET | `/posts/my/posts` | Get current user's posts | ✅ |

### Query Parameters

**Pagination (available on list endpoints):**
```
?page=1&limit=10
```

**Filter user posts:**
```
/posts/my/posts?published=true
/posts/my/posts?published=false
```

## 🔧 API Usage Examples

### Register a new user
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "johndoe",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Create a blog post
```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "My First Blog Post",
    "content": "This is the content of my first blog post...",
    "published": true
  }'
```

### Get all posts with pagination
```bash
curl "http://localhost:3000/api/posts?page=1&limit=5"
```

## 📊 Database Schema

### User Model
```typescript
{
  id: string (CUID)
  email: string (unique)
  username: string (unique)  
  password: string (hashed)
  createdAt: DateTime
  updatedAt: DateTime
  posts: Post[]
}
```

### Post Model
```typescript
{
  id: string (CUID)
  title: string
  content: string
  published: boolean (default: false)
  createdAt: DateTime
  updatedAt: DateTime
  authorId: string (foreign key)
  author: User
}
```

## 🔒 Authentication

This API uses JWT (JSON Web Tokens) for authentication. After successful login, include the token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

Tokens expire after 7 days and need to be refreshed by logging in again.

## 📁 Project Structure

```
src/
├── controllers/
│   ├── authController.ts    # Authentication logic
│   └── postController.ts    # Blog post logic
├── middleware/
│   └── auth.ts             # JWT authentication middleware
├── routes/
│   ├── auth.ts             # Authentication routes
│   └── posts.ts            # Blog post routes
├── prisma/
│   └── schema.prisma       # Database schema
└── server.ts               # Express app setup
```

## 🛡️ Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **JWT Authentication**: Stateless authentication with secure tokens
- **Input Validation**: All inputs are validated and sanitized
- **Authorization**: Users can only modify their own posts
- **Error Handling**: Secure error responses without sensitive information

## 🚀 Deployment

### Environment Variables for Production
```env
DATABASE_URL="your-production-database-url"
JWT_SECRET="your-production-jwt-secret"
PORT=3000
NODE_ENV=production
```

### Build Commands
```bash
# Install dependencies
npm ci

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Build TypeScript
npm run build

# Start production server
npm start
```

## 🧪 Testing

Test the API endpoints using tools like:
- **Postman** - GUI-based API testing
- **curl** - Command-line HTTP client  
- **Thunder Client** - VS Code extension
- **Insomnia** - API testing tool

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Hakan Fırat**
- GitHub: [@hknfrt](https://github.com/hknfrt)


## 🙏 Acknowledgments

- Built as a learning project to master Node.js, TypeScript, and PostgreSQL
- Implements industry-standard practices for authentication and API design
- Designed with scalability and maintainability in mind

---

⭐ **Star this repository if you found it helpful!**