import { defineConfig } from "drizzle-kit";

// Note: This is a placeholder configuration for when MongoDB is implemented
// Currently the project uses in-memory storage

export default defineConfig({
  out: "./server/migrations",
  schema: "./server/schema.ts",
  dialect: "postgresql", // This will change when MongoDB is implemented
  // dbCredentials will be added when actual database connection is set up
});