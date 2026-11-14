# ⚡ TechPulse — MERN Stack Technology Blog Website

A clean, modern, and production-ready **Full Stack Technology Blog & Content Management System (CMS)** built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) and styled with utility-first **Tailwind CSS**.

---

## 🌟 Features Breakdown

### 1. 🏠 Homepage
- **Navigation Bar & Brand Identity**: Responsive header featuring the *TechPulse* logo, topic links, and instant access to the Admin CMS.
- **Dynamic Live Search**: Real-time searching across post titles, summaries, contents, and authors with clear and quick suggestion tags.
- **Taxonomy / Category Navigation**: Interactive filter pills with real-time post counts covering the 7 core technical categories:
  1. Software Development
  2. Artificial Intelligence & Machine Learning
  3. Web and Mobile App Development
  4. Technology & Innovation
  5. Cybersecurity
  6. Cloud Computing
  7. Industry Insights
- **Hero Featured Story Banner**: Dedicated visual spotlight for the top featured article.
- **Responsive Article Grid**: Cards showing high-res tech covers, category badge, publication date, author details with avatar, read time, view count, and excerpt.

### 2. 📖 Blog Detail Page
- **Full Article View**: Clean typography with headers, lists, syntax-styled code blocks, and blockquotes.
- **Author Bio Card**: Displays the writer's avatar, name, and technical engineering role.
- **Publication Meta**: Formatted publication date, estimated read time, views counter, and category pill.
- **Interaction Tools**: 1-click **Share & Copy Link** button with visual feedback, and "Back to Articles" navigation.
- **Related Articles**: Automatically surfaces related stories in the same category.

### 3. 🔐 Admin Panel (CMS)
- **Secure Authentication**: Protected routes using JWT (JSON Web Tokens) with a clean sign-in screen and 1-click demo credential autofill.
- **Overview Dashboard**:
  - Metrics cards: Total Posts, Published, Drafts, Categories, and Total Views.
  - Interactive articles table with status pills, dates, views, search filter, and category filter.
  - Action buttons to View Live, Edit, or Delete (with safety confirmation dialog).
- **Article Editor (Create & Edit)**:
  - Title, auto-generated URL slug, category selector, author, and excerpt.
  - Markdown helper toolbar (H2, H3, Code blocks, Lists, Quotes).
  - 6 Instant preset high-res tech cover images + custom URL input.
  - Draft vs. Published toggle and Homepage Featured checkbox.
  - **Live Preview Tab**: Toggle side-by-side to review formatting before publishing.
- **Category Manager**:
  - View all 7 core categories and any newly added ones.
  - Add, edit, or delete categories with post-count safety warnings.

### 4. 🛠️ Tech Stack & Database Architecture
- **Backend**: Node.js & Express.js REST API with modular controllers, routes, and error handling.
- **Database & Schemas**: MongoDB Mongoose schemas for `Post`, `Category`, and `User`.
- **Hybrid Resilience**: Automatically connects to local MongoDB or MongoDB Atlas if configured. If MongoDB is not running locally, it seamlessly switches to an automated persistent JSON store so developers can test the entire site immediately without database installation friction.
- **Frontend**: React 19 + Vite + Tailwind CSS + Lucide React + React Router v6.

---

## 📂 Project Structure

```text
rohit project/
├── backend/
│   ├── config/
│   │   └── db.js               # Mongoose DB connection & fallback detection
│   ├── controllers/
│   │   ├── authController.js   # Admin login & JWT generation
│   │   ├── categoryController.js # Category CRUD operations
│   │   └── postController.js   # Blog post CRUD, search, filter, and stats
│   ├── data/
│   │   ├── initialData.js      # Seed categories & rich technical articles
│   │   ├── store.js            # Unified data layer (Mongoose + Persistent fallback)
│   │   └── storage/            # Local JSON persistence directory
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT verification middleware
│   ├── models/
│   │   ├── Category.js         # Mongoose Category Schema
│   │   ├── Post.js             # Mongoose Blog Post Schema
│   │   └── User.js             # Mongoose Admin User Schema with bcrypt
│   ├── routes/
│   │   ├── authRoutes.js       # /api/auth
│   │   ├── categoryRoutes.js   # /api/categories
│   │   └── postRoutes.js       # /api/posts
│   ├── seeder/
│   │   └── seedData.js         # Standalone data seeder
│   ├── .env                    # Environment variables
│   ├── package.json
│   └── server.js               # Express application entry point
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js          # Centralized Fetch API client
│   │   ├── components/
│   │   │   ├── CategoryFilter.jsx # Category pill filter with counts
│   │   │   ├── FeaturedPost.jsx   # Hero banner for top article
│   │   │   ├── Footer.jsx         # Site footer with stack info
│   │   │   ├── Navbar.jsx         # Responsive navigation & brand logo
│   │   │   ├── PostCard.jsx       # Blog post card component
│   │   │   ├── ProtectedRoute.jsx # Route guard for Admin CMS
│   │   │   └── SearchBar.jsx      # Real-time search with tags
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # React authentication context
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx # CMS table, metrics, delete modal
│   │   │   ├── AdminLogin.jsx     # Admin sign-in screen
│   │   │   ├── BlogDetailPage.jsx # Full article reading page
│   │   │   ├── CategoryManager.jsx# Category management
│   │   │   ├── HomePage.jsx       # Homepage with search & grid
│   │   │   ├── NotFound.jsx       # 404 handler
│   │   │   └── PostEditor.jsx     # Create & Edit post with preview
│   │   ├── App.jsx             # Main Router layout
│   │   ├── index.css           # Tailwind directives
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── run-all.js                  # Concurrently runs backend & frontend
├── README.md
└── package.json                # Root automation scripts
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18 or higher installed)
- **MongoDB** *(Optional)*: If you have MongoDB or MongoDB Atlas, configure your connection string in `backend/.env`. If you do not have MongoDB running, the application will automatically run with the built-in persistent storage without any setup needed!

### 2. Start Both Backend & Frontend Together
From the root directory:
```bash
npm run dev
```
This launches:
- **Backend API**: `http://localhost:5000`
- **Frontend App**: `http://localhost:5173`

---

## 🔐 Admin CMS Credentials

To test the Admin CMS:
1. Click **"Admin Login"** in the top navigation or navigate to `http://localhost:5173/admin/login`.
2. Use the credentials below or click the **"Autofill Demo Credentials"** button:
   - **Email**: `admin@techblog.com`
   - **Password**: `admin123`
3. You now have full access to create new articles, edit existing posts, delete articles, and manage categories.

---

## 📡 REST API Endpoints

### Blog Posts
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/posts` | List posts (filters: `search`, `category`, `page`) | No |
| `GET` | `/api/posts/:idOrSlug` | Get single post & increment view count | No |
| `POST` | `/api/posts` | Create new post | Yes (Bearer Token) |
| `PUT` | `/api/posts/:id` | Update existing post | Yes (Bearer Token) |
| `DELETE`| `/api/posts/:id` | Delete post | Yes (Bearer Token) |

### Categories
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/categories` | List categories with post counts | No |
| `POST` | `/api/categories` | Create category | Yes (Bearer Token) |
| `PUT` | `/api/categories/:id`| Update category | Yes (Bearer Token) |
| `DELETE`| `/api/categories/:id`| Delete category | Yes (Bearer Token) |

### Authentication & System
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Admin login & obtain JWT | No |
| `GET` | `/api/auth/me` | Verify JWT and return current admin profile | Yes |
| `GET` | `/api/stats` | CMS metrics overview (Posts, Views, Categories) | No |
| `GET` | `/api/health` | API health check & active DB status | No |

---

## ⚙️ Environment Configuration (`backend/.env`)

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/tech_blog
JWT_SECRET=super_secret_tech_blog_jwt_token_2026_xyz
ADMIN_EMAIL=admin@techblog.com
ADMIN_PASSWORD=admin123
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```
