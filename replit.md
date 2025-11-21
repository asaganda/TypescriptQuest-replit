# TypeScript Quest - Gamified Learning Platform

## Overview

TypeScript Quest is a gamified educational web application designed to teach TypeScript through interactive lessons and challenges. The platform features a progression-based learning system with XP tracking, badges, and multiple challenge types including multiple-choice quizzes and code exercises. Users advance through levels by completing lessons and challenges, earning experience points and achievements along the way.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool

**UI Component Library**: shadcn/ui (Radix UI primitives) with Tailwind CSS for styling
- Design system follows educational platform patterns (Duolingo, Khan Academy, Codecademy)
- Custom color scheme with CSS variables for theming support
- Typography: Inter for UI text, JetBrains Mono for code blocks
- Responsive layout with mobile-first approach

**State Management**: 
- TanStack Query (React Query) for server state management and caching
- React Context API for authentication state
- Component-level state using React hooks

**Routing**: Wouter for lightweight client-side routing

**Key Frontend Patterns**:
- Protected routes requiring authentication
- Component composition with reusable UI primitives
- Custom hooks for shared logic (toast notifications, mobile detection)
- Separation of concerns: pages, components, and utilities

### Backend Architecture

**Server Framework**: Express.js with TypeScript

**Development vs Production**:
- Development mode: Vite dev server with HMR middleware integration
- Production mode: Static file serving from build output
- Dual entry points (index-dev.ts and index-prod.ts)

**Session Management**: 
- Express-session for session handling
- Cookie-based authentication
- Session secret configurable via environment variables

**API Design**:
- RESTful endpoints under `/api` prefix
- Session-based authentication middleware
- JSON request/response format

**Key Backend Patterns**:
- Middleware-based authentication
- Repository pattern through storage interface
- Request logging with timing information
- Error handling with appropriate HTTP status codes

### Data Storage

**Database**: PostgreSQL (configured for use with Neon serverless)

**ORM**: Drizzle ORM
- Type-safe database queries
- Schema-first approach with TypeScript types
- Migration support via drizzle-kit

**Schema Design**:
- **users**: Authentication and profile data
- **levels**: Learning progression tiers with XP requirements
- **lessons**: Educational content organized by levels
- **challenges**: Interactive exercises (multiple-choice and code-based)
- **user_progress**: Tracking completed lessons and challenges
- **user_stats**: Aggregated user metrics (XP, current level, completion counts)
- **badges**: Achievement definitions
- **user_badges**: User achievement tracking

**Storage Layer**: 
- Interface-based abstraction (IStorage) for database operations
- Supports both in-memory (development) and PostgreSQL implementations
- CRUD operations for all entities
- Progress tracking methods

### Authentication & Authorization

**Authentication Method**: Email and password with bcrypt for password hashing

**Session Flow**:
1. User credentials validated against database
2. Session created and stored server-side
3. Session ID stored in HTTP-only cookie
4. Subsequent requests authenticated via session middleware

**Authorization**: Route-level protection using `requireAuth` middleware

### External Dependencies

**UI Component Libraries**:
- @radix-ui/* - Accessible, unstyled UI primitives for dialogs, dropdowns, navigation, etc.
- Tailwind CSS - Utility-first styling framework
- class-variance-authority - Type-safe variant styling
- lucide-react - Icon library

**Form Handling**:
- react-hook-form - Form state management
- @hookform/resolvers - Schema validation integration
- zod - TypeScript-first schema validation

**Database & Backend**:
- @neondatabase/serverless - PostgreSQL connection for Neon
- drizzle-orm - TypeScript ORM
- express-session - Session management
- connect-pg-simple - PostgreSQL session store
- bcryptjs - Password hashing

**Development Tools**:
- Vite - Build tool and dev server
- tsx - TypeScript execution for development
- esbuild - Production bundling
- @replit/* plugins - Replit-specific development enhancements

**Gamification System**:
- XP-based progression with configurable thresholds
- Badge system for achievements
- Challenge validation patterns for code exercises
- Completion tracking at lesson and challenge level