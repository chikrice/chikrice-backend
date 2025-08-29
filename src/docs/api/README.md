# API Documentation

This directory contains the API documentation for the ChikRice Backend.

## Structure

- `swaggerDef.js` - Swagger/OpenAPI configuration
- `components.yml` - API schemas and components
- `README.md` - This documentation file

## Accessing the API

Once the server is running, you can access:

- **Swagger UI**: `http://localhost:3000/v1/docs`
- **API Health Check**: `http://localhost:3000/v1/health`

## API Endpoints

### Authentication

- `POST /v1/auth/register` - User registration
- `POST /v1/auth/login` - User login
- `POST /v1/auth/logout` - User logout
- `POST /v1/auth/refresh-tokens` - Refresh access token
- `POST /v1/auth/forgot-password` - Request password reset
- `POST /v1/auth/reset-password` - Reset password
- `POST /v1/auth/send-verification-email` - Send verification email
- `POST /v1/auth/verify-email` - Verify email address

### Users

- `GET /v1/users` - Get all users (admin only)
- `POST /v1/users` - Create user (admin only)
- `GET /v1/users/:userId` - Get user by ID
- `PATCH /v1/users/:userId` - Update user
- `DELETE /v1/users/:userId` - Delete user (admin only)

### Roadmaps

- `GET /v1/roadmaps` - Get user roadmaps
- `POST /v1/roadmaps` - Create roadmap
- `GET /v1/roadmaps/:roadmapId` - Get roadmap by ID
- `PATCH /v1/roadmaps/:roadmapId` - Update roadmap
- `DELETE /v1/roadmaps/:roadmapId` - Delete roadmap

### Plans

- `GET /v1/plans-month` - Get monthly plans
- `POST /v1/plans-month` - Create monthly plan
- `GET /v1/plans-day` - Get daily plans
- `POST /v1/plans-day` - Create daily plan

### Ingredients

- `GET /v1/ingredients` - Get all ingredients
- `POST /v1/ingredients` - Create ingredient (admin only)
- `GET /v1/ingredients/:ingredientId` - Get ingredient by ID
- `PATCH /v1/ingredients/:ingredientId` - Update ingredient
- `DELETE /v1/ingredients/:ingredientId` - Delete ingredient

### FAQs

- `GET /v1/faqs` - Get all FAQs
- `POST /v1/faqs` - Create FAQ (admin only)
- `GET /v1/faqs/:faqId` - Get FAQ by ID
- `PATCH /v1/faqs/:faqId` - Update FAQ
- `DELETE /v1/faqs/:faqId` - Delete FAQ

### Coaches

- `GET /v1/coaches` - Get all coaches
- `POST /v1/coaches` - Create coach (admin only)
- `GET /v1/coaches/:coachId` - Get coach by ID
- `PATCH /v1/coaches/:coachId` - Update coach
- `DELETE /v1/coaches/:coachId` - Delete coach

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Error Responses

The API uses standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

Authentication endpoints are rate-limited to prevent abuse. Limits are applied per IP address.
