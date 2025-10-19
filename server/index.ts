import express, { type Request, Response, NextFunction } from "express";
import routes from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { loggingMiddleware } from "./middlewares/logging.middleware";
import { createServer } from "http";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(loggingMiddleware);

// Logging middleware has been moved to middlewares/logging.middleware.ts

(async () => {
  // Create HTTP server
  const server = createServer(app);
  
  // Use the routes
  app.use(routes);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Serve the app on port 3007
  const port = 3007;
  server.listen(port, () => {
    log(`serving on port ${port}`);
  });
})();