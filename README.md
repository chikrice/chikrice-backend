# ChikRice Backend

A comprehensive Node.js backend service for the ChikRice fitness application, built with Express.js, MongoDB, and TypeScript.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with Google OAuth support
- **User Management**: Complete user CRUD operations with role-based access
- **Meal Planning**: Meal generation and planning system
- **Roadmap System**: Fitness goal tracking and milestone management
- **Email Notifications**: Password reset, email verification, and notifications
- **API Documentation**: Auto-generated Swagger/OpenAPI documentation
- **Testing**: Comprehensive test suite with Jest
- **Docker Support**: Containerized deployment with Docker Compose

## 📋 Prerequisites

- Node.js (>= 12.0.0)
- Docker & Docker Compose
- Git

## 🛠️ Quick Setup

### Option 1: Docker Setup

**The easiest way to get started:**

```bash
# 1. Clone the repository
git clone https://github.com/chikrice/chikrice-backend.git
cd chikrice-backend

# 2. Copy environment file
cp env.example .env

# 3. Start the application with Docker
yarn docker:dev
```

**That's it!** Your application will be running at `http://localhost:3000` with:

- ✅ Node.js application with hot reload
- ✅ MongoDB database
- ✅ All dependencies installed
- ✅ Development environment configured

**💡 Recommended: Use MongoDB Compass for Database Management**

For a better development experience, we recommend using [MongoDB Compass](https://www.mongodb.com/products/compass) - a GUI for MongoDB:

1. **Download** MongoDB Compass from the official website
2. **Connect** using: `mongodb://localhost:27017`
3. **Browse** your databases, collections, and documents visually
4. **Build queries** using the visual query builder
5. **Analyze** your data structure and performance

### Option 2: Manual Setup

If you prefer to set up everything manually:

#### 1. Clone and Install Dependencies

```bash
git clone https://github.com/your-username/chikrice-backend.git
cd chikrice-backend
yarn install
```

#### 2. Environment Configuration

```bash
# Copy the example environment file
cp env.example .env

# Edit with your configuration
nano .env
```

#### 3. Database Setup

**Option A: Local MongoDB**

**Using Docker:**

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Using Manual Installation:**

- **macOS**: Follow the [official MongoDB installation guide](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)
- **Ubuntu/Debian**: Follow the [official MongoDB installation guide](https://docs.mongodb.com/manual/administration/install-on-linux/)
- **Windows**: Follow the [official MongoDB installation guide](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)

**Option B: MongoDB Atlas (Cloud - Recommended for production)**

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URL_DEV` in your `.env` file

#### 4. Start Development Server

```bash
yarn dev
```

The server will start at `http://localhost:3000`

## 🔧 Environment Variables

### Required Variables

| Variable          | Description              | Example                                                                                   |
| ----------------- | ------------------------ | ----------------------------------------------------------------------------------------- |
| `NODE_ENV`        | Environment mode         | `development`                                                                             |
| `PORT`            | Server port              | `3000`                                                                                    |
| `MONGODB_URL_DEV` | Development database URL | `mongodb://localhost:27017/chikrice`                                                      |
| `JWT_SECRET`      | JWT signing secret       | Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |

### Optional Variables (for full functionality)

| Variable               | Description                | Setup Guide                                       |
| ---------------------- | -------------------------- | ------------------------------------------------- |
| `GOOGLE_CLIENT_ID`     | Google OAuth Client ID     | [Google Cloud Console Setup](#google-oauth-setup) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | [Google Cloud Console Setup](#google-oauth-setup) |
| `SMTP_HOST`            | Email server host          | [Email Setup](#email-setup)                       |
| `SMTP_USERNAME`        | Email username             | [Email Setup](#email-setup)                       |
| `SMTP_PASSWORD`        | Email password             | [Email Setup](#email-setup)                       |
| `OPENAI_API_KEY`       | OpenAI API key             | [OpenAI Setup](#openai-setup)                     |

## 🐳 Docker Commands

### Development (Recommended)

```bash
yarn docker:dev
```

### Production

```bash
yarn docker:prod
```

### Testing

```bash
yarn docker:test
```

## 🔐 Third-Party Service Setup

### Google OAuth Setup

For Google authentication functionality:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3030/auth/callback` (development)
   - `https://yourdomain.com/` (production)
7. Copy the Client ID and Client Secret to your `.env` file

### Email Setup

For email functionality (password reset, verification):

**Gmail (Recommended for development)**

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password: Google Account → Security → App Passwords
3. Use your Gmail address and the generated app password

### OpenAI Setup

For AI-powered meal generation:

1. Sign up at [OpenAI](https://platform.openai.com/)
2. Go to API Keys section
3. Create a new API key
4. Add it to your `.env` file

## 📚 API Documentation

Once the server is running, you can access:

- **Swagger UI**: `http://localhost:3000/v1/docs`
- **API Health Check**: `http://localhost:3000/v1/health`

## 📁 Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── middlewares/     # Custom middlewares
├── models/          # Database models
├── routes/          # API routes
├── services/        # Business logic
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── validations/     # Request validation schemas
```

## 🎨 Frontend Development

**If you are a frontend developer**

This repository contains the **backend API** for the ChikRice fitness application. If you're interested in working on the **frontend side**, we have a separate repository dedicated to the user interface:

### 🌐 Frontend Repository

**[chikrice-user-frontend](https://github.com/chikrice/chikrice-user-frontend)**

The frontend is built with modern technologies including:

- **React 18** with TypeScript
- **Material-UI (MUI)** for professional UI components
- **Zustand** for state management
- **Vite** for fast development
- **React Hook Form** for form handling

### 🚀 Quick Start for Frontend

```bash
# Clone the frontend repository
git clone https://github.com/chikrice/chikrice-user-frontend.git
cd chikrice-user-frontend

# Install dependencies
yarn install

# Start development server
yarn dev
```

The frontend will run at `http://localhost:3030` and will connect to this backend API at `http://localhost:3000`.

### 🔗 Full-Stack Development

For a complete development experience, you can run both repositories simultaneously:

1. **Backend** (this repo): `yarn docker:dev` → `http://localhost:3000`
2. **Frontend**: `yarn dev` → `http://localhost:3030`

This setup allows you to work on both the API and the user interface in parallel!

## 📦 Archived Features

The `archive/` folder contains legacy features that are no longer actively used in the main project but are preserved for reference or potential future re-integration. These archived features include:

- **Meal Management System**: Legacy meal planning and generation logic
- **Combo Management**: Previous combo meal creation and management features
- **Menu Management**: Archived menu planning and organization system
- **Subscription System**: Legacy subscription handling and management

These features have been replaced by the current meal planning and roadmap systems but are maintained for historical reference and potential future use.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on:

- Code style guidelines
- Testing requirements
- Pull request process

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📖 [Documentation](./docs/)
- 🐛 [Report Issues](https://github.com/chikrice/chikrice-backend/issues)
- 💬 [Discussions](https://github.com/chikrice/chikrice-backend/discussions)

## 🙏 Acknowledgments

- [@hagopj13/node-express-boilerplate](https://github.com/hagopj13/node-express-boilerplate.git) - This project was built upon the excellent Node.js Express boilerplate by Hagop Jamkojian
- Express.js team for the amazing framework
- MongoDB team for the database
- All contributors who help improve this project

---

**Note**: This is an open-source project. Please ensure you never commit sensitive information like API keys or database credentials to the repository.
