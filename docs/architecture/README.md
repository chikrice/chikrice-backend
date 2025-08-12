# ChikRice Backend Architecture

## Table of Contents

1. [Overview](#overview)
2. [Architectural Style](#architectural-style)
3. [System Architecture](#system-architecture)
4. [Layered Architecture](#layered-architecture)
5. [Data Flow](#data-flow)
6. [Security Architecture](#security-architecture)
7. [Database Architecture](#database-architecture)
8. [API Architecture](#api-architecture)
9. [Service Architecture](#service-architecture)
10. [Deployment Architecture](#deployment-architecture)
11. [Testing Architecture](#testing-architecture)
12. [Performance Considerations](#performance-considerations)

## Overview

The ChikRice backend is a **Node.js/TypeScript REST API** built with Express.js and MongoDB, designed to power a comprehensive fitness and meal planning application. The architecture follows modern software engineering principles with a focus on scalability, maintainability, and security.

### Key Characteristics

- **Language**: TypeScript/JavaScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + Passport.js + Google OAuth
- **Architecture Pattern**: Layered Architecture (N-tier)
- **Design Pattern**: MVC (Model-View-Controller)

## Architectural Style

### Layered Architecture (N-tier)

The application follows a **layered architecture** pattern with clear separation of concerns:

```
┌─────────────────────────────────────┐
│        Presentation Layer           │  ← Routes & Controllers
├─────────────────────────────────────┤
│        Business Logic Layer         │  ← Services
├─────────────────────────────────────┤
│        Data Access Layer            │  ← Models & Database
├─────────────────────────────────────┤
│        Infrastructure Layer         │  ← Config, Utils, Middleware
└─────────────────────────────────────┘
```

### Design Principles

- **Separation of Concerns**: Each layer has a specific responsibility
- **Dependency Inversion**: Higher layers depend on abstractions
- **Single Responsibility**: Each module has one reason to change
- **Open/Closed Principle**: Open for extension, closed for modification

## System Architecture

### High-Level System Components

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client Apps   │    │   Load Balancer │    │   API Gateway   │
│   (Mobile/Web)  │◄──►│   (Optional)    │◄──►│   (Future)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ChikRice Backend                             │
├─────────────────┬─────────────────┬─────────────────────────────┤
│   Express App   │   Background    │   External Services         │
│   (Main API)    │   Jobs (Cron)   │   (OpenAI, Google, Email)   │
└─────────────────┴─────────────────┴─────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────┐
│                    MongoDB Database                              │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌────────────┐  │
│  │   Users     │ │  Roadmaps   │ │   Plans     │ │ Ingredients│  │
│  └─────────────┘ └─────────────┘ └─────────────┘ └────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

## Layered Architecture

### 1. Presentation Layer (`src/routes/v1/`)

**Responsibility**: Handle HTTP requests and responses

**Components**:

- **Route Handlers**: Define API endpoints
- **Request Validation**: Input validation using Joi/Zod
- **Response Formatting**: Consistent JSON responses
- **Middleware Integration**: Auth, rate limiting, CORS

**Key Routes**:

```
/v1/auth          - Authentication endpoints
/v1/users         - User management
/v1/coaches       - Coach management
/v1/roadmaps      - Fitness goal tracking
/v1/plans-day     - Daily meal planning
/v1/plans-month   - Monthly planning
/v1/ingredients   - Ingredient management
/v1/faqs          - FAQ system
```

### 2. Business Logic Layer (`src/services/`)

**Responsibility**: Core business logic and domain operations

**Key Services**:

- **AuthService**: Authentication and authorization logic
- **RoadmapService**: Fitness goal tracking and milestone management
- **PlanDayService**: Daily meal planning and generation
- **PlanMonthService**: Monthly planning and scheduling
- **UserService**: User management and profile operations
- **EmailService**: Email notifications and templates
- **CoachService**: Coach-specific operations

**Service Patterns**:

- **Repository Pattern**: Services act as repositories for domain entities
- **Factory Pattern**: Service factories for creating domain objects
- **Strategy Pattern**: Different strategies for meal generation, authentication

### 3. Data Access Layer (`src/models/`)

**Responsibility**: Database schema definitions and data persistence

**Key Models**:

- **User Models**: BaseUser, User, Coach, Admin (inheritance pattern)
- **Roadmap**: Fitness goal tracking with milestones
- **Plan Models**: PlanDay, PlanMonth for meal planning
- **Ingredient**: Food ingredient management
- **FAQ**: Support system

**Database Patterns**:

- **Schema Design**: Mongoose schemas with validation
- **Indexing Strategy**: Optimized queries with proper indexes
- **Data Relationships**: References and population patterns

### 4. Infrastructure Layer

**Configuration** (`src/config/`):

- Environment-based configuration
- Database connection settings
- JWT configuration
- External service credentials

**Middleware** (`src/middlewares/`):

- Authentication middleware
- Error handling middleware
- Rate limiting middleware
- Request validation middleware

**Utilities** (`src/utils/`):

- Common utility functions
- Error handling utilities
- Time formatting utilities

## Data Flow

### Request Processing Flow

```
1. HTTP Request
   ↓
2. Express Router (src/routes/v1/)
   ↓
3. Middleware Chain
   ├── CORS
   ├── Helmet (Security)
   ├── Rate Limiting
   ├── Authentication
   └── Validation
   ↓
4. Route Handler (Controller)
   ↓
5. Service Layer (Business Logic)
   ↓
6. Model Layer (Data Access)
   ↓
7. MongoDB Database
   ↓
8. Response (JSON)
```

### Response Flow

```
1. Database Result
   ↓
2. Model Processing
   ↓
3. Service Layer Processing
   ↓
4. Controller Response Formatting
   ↓
5. Middleware Processing
   ↓
6. JSON Response to Client
```

## Security Architecture

### Multi-Layered Security Approach

#### 1. Network Level Security

- **CORS Configuration**: Controlled cross-origin requests
- **Rate Limiting**: Protection against brute force attacks
- **Helmet**: Security headers (XSS, CSRF protection)

#### 2. Application Level Security

- **JWT Authentication**: Stateless authentication
- **Google OAuth**: Social login integration
- **Input Validation**: Joi/Zod schema validation
- **XSS Protection**: Request sanitization
- **MongoDB Sanitization**: NoSQL injection prevention

#### 3. Data Level Security

- **Password Hashing**: bcryptjs for password security
- **Token Management**: Secure token storage and rotation
- **Role-based Access**: User, Coach, Admin roles

### Authentication Flow

```
1. Client Login Request
   ↓
2. Credential Validation
   ↓
3. JWT Token Generation
   ↓
4. Token Storage (Client)
   ↓
5. Subsequent Requests with Token
   ↓
6. Token Validation (Passport.js)
   ↓
7. User Context Available
```

## Database Architecture

### MongoDB Schema Design

#### User Management

```javascript
// Base User Schema
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  role: String (user/coach/admin),
  profile: {
    name: String,
    avatar: String,
    preferences: Object
  }
}
```

#### Roadmap System

```javascript
// Roadmap Schema
{
  _id: ObjectId,
  userId: ObjectId,
  goal: String,
  startDate: Date,
  targetDate: Date,
  milestones: [{
    title: String,
    targetDate: Date,
    completed: Boolean
  }],
  weightProgression: [{
    date: Date,
    weight: Number
  }]
}
```

#### Meal Planning

```javascript
// Plan Day Schema
{
  _id: ObjectId,
  userId: ObjectId,
  date: Date,
  meals: [{
    type: String (breakfast/lunch/dinner/snack),
    ingredients: [{
      ingredientId: ObjectId,
      quantity: Number,
      unit: String
    }],
    macros: {
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number
    }
  }]
}
```

### Database Optimization

- **Indexing Strategy**: Compound indexes for common queries
- **Connection Pooling**: Efficient database connections
- **Query Optimization**: Lean queries for performance
- **Data Validation**: Schema-level validation

## API Architecture

### RESTful API Design

#### Endpoint Structure

```
GET    /v1/users           - List users
GET    /v1/users/:id       - Get user by ID
POST   /v1/users           - Create user
PUT    /v1/users/:id       - Update user
DELETE /v1/users/:id       - Delete user
```

#### Response Format

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Success message",
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100
  }
}
```

#### Error Handling

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

### API Versioning

- **URL Versioning**: `/v1/` prefix for API versioning
- **Backward Compatibility**: Maintained across versions
- **Documentation**: Auto-generated Swagger documentation

## Testing Architecture

### Testing Strategy

#### Unit Testing

- **Service Layer**: Business logic testing
- **Utility Functions**: Helper function testing
- **Model Methods**: Database operation testing

#### Integration Testing

- **API Endpoints**: End-to-end API testing
- **Database Operations**: Real database testing
- **Authentication Flow**: Complete auth flow testing

#### Test Structure

```
tests/
├── unit/           - Unit tests
├── integration/    - Integration test
```
