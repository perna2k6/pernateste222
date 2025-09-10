# Passinhos de Luz - Christian Children's Activity Books Landing Page

## Overview

This is a full-stack web application for "Passinhos de Luz," a digital collection of Christian children's activity books. The application serves as a landing page and e-commerce platform for selling PDF downloads of 12 illustrated biblical activity books targeted at children ages 3-10. The site features a modern, conversion-optimized design with interactive elements like countdown timers, social proof notifications, and product carousels to drive sales.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built with **React 18** using **TypeScript** and follows a modern component-based architecture:

- **Routing**: Uses Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with custom design system using CSS variables for theming
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent, accessible components
- **State Management**: React Query (@tanstack/react-query) for server state management and data fetching
- **Form Handling**: React Hook Form with Zod validation for type-safe forms
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
The backend follows a **Node.js/Express** server architecture:

- **Framework**: Express.js with TypeScript for type safety
- **Development Setup**: Custom Vite integration for hot module replacement in development
- **API Structure**: RESTful API design with `/api` prefix for all endpoints
- **Storage Interface**: Abstracted storage layer with in-memory implementation (MemStorage class)
- **Middleware**: Custom request/response logging and error handling middleware

### Data Storage Solutions
The application uses a **hybrid storage approach**:

- **Development**: In-memory storage using Map data structures for rapid prototyping
- **Production Ready**: Drizzle ORM configured for PostgreSQL with Neon database integration
- **Schema Management**: Shared TypeScript schemas between client and server using Zod for validation
- **Database Config**: Drizzle Kit for migrations and schema management

### Authentication and Authorization
Currently implements a **basic user system**:

- **User Model**: Simple username/password structure stored in users table
- **Session Management**: connect-pg-simple for PostgreSQL session storage
- **Validation**: Zod schemas for input validation and type safety

### Design System and UI
The application uses a **comprehensive design system**:

- **Component Library**: Full shadcn/ui implementation with 40+ components
- **Theming**: CSS custom properties for light/dark mode support
- **Typography**: Custom font loading (Inter, Architects Daughter, DM Sans, Fira Code, Geist Mono)
- **Responsive Design**: Mobile-first approach with custom mobile detection hook
- **Animations**: Tailwind CSS animations with custom carousel implementations

### Performance Optimizations
Several performance-focused architectural decisions:

- **Code Splitting**: Vite's automatic code splitting for optimal bundle sizes
- **Image Optimization**: External CDN hosting for product images
- **Query Optimization**: React Query with infinite stale time for static content
- **Bundle Analysis**: ESBuild for production builds with external package handling

## External Dependencies

### Database and Infrastructure
- **Neon Database**: Serverless PostgreSQL for production data storage
- **Drizzle ORM**: Type-safe database operations with automatic migration support

### UI and Design Libraries
- **Radix UI**: Unstyled, accessible component primitives (40+ components imported)
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **Lucide React**: Icon library for consistent iconography
- **Embla Carousel**: Lightweight carousel component for product displays

### Development and Build Tools
- **Vite**: Fast build tool with React plugin and custom configurations
- **TypeScript**: Static typing with strict configuration
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind and Autoprefixer

### Third-Party Integrations
- **React Query**: Server state management and caching
- **React Hook Form**: Form handling with validation
- **Zod**: Schema validation for forms and API data
- **Date-fns**: Date manipulation utilities
- **Class Variance Authority**: Utility for component variant management

### Development Tools
- **tsx**: TypeScript execution for development server
- **Replit Integration**: Custom cartographer plugin and runtime error modal for Replit environment
- **Hot Module Replacement**: Vite HMR integration with Express server