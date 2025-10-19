# Server Database Configuration

This directory contains the database configuration for the car dealership project.

## Current State
- The project currently uses in-memory storage for development
- Drizzle ORM configuration is set up for future PostgreSQL integration
- Schema definitions are located in `schema.ts`

## Future Implementation
When MongoDB is implemented, the drizzle.config.ts file will be updated to use the appropriate dialect and connection settings.

## Migration Commands
Once a database is connected, you can use the following commands:
- `npm run db:push` - Push schema changes to the database
- `npm run db:migrate` - Run database migrations (to be implemented)