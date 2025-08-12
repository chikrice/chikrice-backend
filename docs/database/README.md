# Database Schema Documentation

This document provides an overview of the ChikRice Backend database schema and relationships.

## Entity Relationship Diagram

![Database Schema](./chikrice-database-schema.png)

## Schema Overview

### User Collection

The User collection uses a discriminator pattern with the `role` field determining the document type:

- **Base User**: Common fields for all user types
- **Client User**: Additional fields for nutrition tracking and meal planning
- **Coach User**: Coach-specific functionality
- **Admin User**: Administrative capabilities

### Core Collections

#### Roadmap

Tracks user's weight loss/gain journey with milestones and progress data.

#### PlanMonth

Monthly meal planning data organized by weeks and days.

#### PlanDay

Individual day meal plans with detailed macro tracking.

#### Ingredient

Nutritional database with multi-language support and macro categorization.

#### Token

Authentication and session management tokens.

#### FAQ

Temp FAQ system.

## Database Technology

- **Database**: MongoDB
- **ODM**: Mongoose
- **Pattern**: Document-based with discriminator inheritance

## Schema Details

For detailed schema definitions, see the individual model files in `src/models/`.
