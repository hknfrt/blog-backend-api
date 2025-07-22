# Blog Frontend Application

A modern, responsive blog frontend built with Next.js 15 and TypeScript. Features a complete authentication system, admin dashboard, and public blog interface with real-time search and social sharing.

## 🚀 Features

- **Authentication System** - JWT-based login/register with protected routes
- **Admin Dashboard** - Post management with CRUD operations and statistics
- **Public Blog Interface** - Modern blog home page with search and pagination
- **Post Editor** - Create and edit blog posts with real-time validation
- **Responsive Design** - Fully optimized for desktop, tablet, and mobile
- **Real-time Search** - Instant post filtering and search functionality
- **Social Sharing** - Share posts via Twitter, LinkedIn, or copy link
- **Print Support** - Print-friendly post layouts

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **HTTP Client:** Axios
- **Routing:** Next.js App Router with dynamic routes
- **Icons:** Heroicons & Emoji

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on port 3000

## ⚡ Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Environment setup
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 3. Start development server
```bash
npm run dev
```

The application will be available at `http://localhost:3001`

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Admin dashboard pages
│   │   ├── page.tsx       # Dashboard home
│   │   ├── new/           # New post page
│   │   └── edit/[id]/     # Edit post page
│   ├── login/             # Login page
│   ├── register/          # Register page
│   ├── post/[id]/         # Post detail page
│   └── page.tsx          # Blog home page
├── components/            # Reusable components
│   ├── AuthProvider.tsx   # Auth context provider
│   ├── ProtectedRoute.tsx # Route protection
│   ├── Navbar.tsx         # Dashboard navigation
│   ├── PublicNavbar.tsx   # Public navigation
│   ├── PostCard.tsx       # Dashboard post card
│   └── BlogPostCard.tsx   # Public blog post card
├── lib/                   # Utility functions
│   ├── api.ts            # Axios configuration
│   ├── auth.ts           # Auth API functions
│   └── posts.ts          # Posts API functions
├── store/                 # State management
│   └── authStore.ts      # Zustand auth store
└── types/                 # TypeScript type definitions
    └── index.ts          # API response types
```

## 🎨 Key Pages

### Public Pages
- **`/`** - Blog home page with search and pagination
- **`/post/[id]`** - Individual post detail page
- **`/login`** - User authentication
- **`/register`** - New user registration

### Protected Pages (Login Required)
- **`/dashboard`** - Admin dashboard with post management
- **`/dashboard/new`** - Create new blog post
- **`/dashboard/edit/[id]`** - Edit existing post

## 🔐 Authentication Flow

1. **Registration/Login** - JWT token received from backend API
2. **Token Storage** - Stored in localStorage with Zustand state management  
3. **Protected Routes** - Automatic redirect to login for unauthorized access
4. **API Integration** - Token automatically added to all API requests
5. **Auto Logout** - Handles token expiration and unauthorized responses

## 🎯 Component Features

### AuthProvider
- Initializes authentication state on app load
- Manages token persistence across browser sessions
- Provides global auth context to all components

### ProtectedRoute
- Wrapper component for pages requiring authentication
- Redirects to login page for unauthenticated users
- Shows loading state during auth verification

### Dashboard
- Real-time statistics (total, published, draft posts)
- Post filtering (All/Published/Drafts)
- CRUD operations with confirmation dialogs
- Pagination for large post lists

### Post Editor
- Rich form validation with character counters
- Draft/Publish toggle functionality
- Auto-save capabilities and error handling
- Preview and formatting options

### Public Blog
- Responsive grid layout for post cards
- Real-time search across titles, content, and authors
- Pagination with smooth scrolling
- Reading time estimation

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile:** `< 640px` - Single column layout
- **Tablet:** `640px - 1024px` - Two column grid
- **Desktop:** `> 1024px` - Three column grid

## 🔧 API Integration

### Base Configuration
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
```

### Automatic Token Management
- JWT token automatically added to request headers
- Token expiration handling with auto-logout
- Error interceptors for consistent error handling

### Available Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User authentication
- `GET /auth/me` - Get current user
- `GET /posts` - Get all published posts
- `GET /posts/:id` - Get single post
- `POST /posts` - Create new post
- `PUT /posts/:id` - Update post
- `DELETE /posts/:id` - Delete post
- `GET /posts/my/posts` - Get user's posts

## 🎨 Styling

### Tailwind CSS
Custom styling with Tailwind CSS utility classes:
- Consistent color scheme with indigo primary colors
- Custom hover states and transitions
- Responsive utility classes
- Custom components for buttons and forms

### Design System
- **Primary Colors:** Indigo (600, 700)
- **Secondary Colors:** Gray (50, 100, 200, 600, 900)
- **Success:** Green (100, 600, 800)
- **Warning:** Yellow (100, 600, 800)
- **Error:** Red (100, 600, 800)

## 🚀 Performance Optimizations

- **Next.js App Router** for optimal routing and performance
- **Lazy Loading** for images and components
- **Client-side Caching** with Zustand for auth state
- **Optimized Bundle Size** with tree-shaking
- **SEO Ready** with proper meta tags and structure

## 🧪 Development

### Available Scripts
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run type-check # Check TypeScript types
```

### Development Features
- Hot reloading with Turbopack (Next.js 15)
- TypeScript strict mode enabled
- ESLint configuration for code quality
- Auto-formatting and import organization

## 🌐 Environment Variables

```env
# Required
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Optional
NODE_ENV=development
```

## 📦 Dependencies

### Core Dependencies
- `next` - React framework with App Router
- `react` & `react-dom` - React library
- `typescript` - TypeScript support
- `tailwindcss` - Utility-first CSS framework
- `zustand` - State management
- `axios` - HTTP client

### Development Dependencies
- `@types/node` - Node.js type definitions
- `@types/react` - React type definitions
- `eslint` - Linting utility
- `eslint-config-next` - Next.js ESLint configuration

## 🤝 Integration with Backend

This frontend is designed to work with the companion Node.js backend API. Ensure the backend is running on port 3000 before starting the frontend development server.

**Backend Repository:** [Backend API Documentation](../backend/README.md)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Hakan Fırat**
- GitHub: [@hknfrt](https://github.com/hknfrt)

---

Built with ❤️ using Next.js 15 and modern web technologies.