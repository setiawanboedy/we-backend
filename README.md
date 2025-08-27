# Windows Explorer API

## Project Description

This project is a REST API for a Windows Explorer-like application built using Clean Architecture. The API provides endpoints for managing folders with hierarchical structure (parent-child) and is integrated with Swagger documentation for easy testing and development.

## Techstack

- **Runtime**: Bun - Fast all-in-one JavaScript runtime
- **Programming Language**: TypeScript - For type safety and better development experience
- **Web Framework**: Elysia - Fast and modern native web framework for Bun
- **Database**: PostgreSQL with Prisma ORM for database management and migrations
- **Architecture**: Clean Architecture with layers:
  - Domain: Business logic and entities
  - Application: Use cases and interfaces
  - Infrastructure: Database and external services
  - Presentation: Controllers and routes
- **Logging**: Winston - For flexible logging
- **API Documentation**: Swagger UI for testing and interactive documentation
- **CORS**: Configuration for frontend development (localhost:5173, localhost:3000)
- **Dependency Injection**: DI system for dependency management

## How to Run

1. Make sure Bun is installed on your system
2. Setup PostgreSQL database and configure DATABASE_URL in environment variables
3. Install dependencies by running the install command
4. Generate Prisma client with the db generate command
5. Run database migrations with the db migrate command
6. Run the application in development mode with the dev command
7. Server will run and can be accessed through available endpoints
8. API documentation can be accessed through Swagger UI

## Project Structure

- `src/application/` - Application layer with services and interfaces
- `src/domain/` - Business logic and entities (Folder with hierarchy)
- `src/infrastructure/` - Infrastructure implementations like database and seeding
- `src/presentation/` - Controllers, routes, and validators
- `prisma/` - Database schema and migrations
- `logs/` - Application log files

This project was created using Bun with focus on performance and good developer experience.
