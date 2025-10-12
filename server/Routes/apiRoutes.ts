import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle
} from "../Controllers/vehicleController";
import {
  createUser,
  loginUser
} from "../Controllers/userController";
import {
  createFinancingApplication,
  getFinancingApplications,
  getFinancingApplicationById
} from "../Controllers/financingController";
import {
  createTestDrive,
  getTestDrives
} from "../Controllers/testDriveController";
import {
  createTradeIn,
  getTradeIns
} from "../Controllers/tradeInController";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes with /api prefix
  const apiRouter = app;
  
  // Vehicle routes
  apiRouter.get("/api/vehicles", getVehicles);
  apiRouter.get("/api/vehicles/:id", getVehicleById);
  apiRouter.post("/api/vehicles", createVehicle);
  apiRouter.put("/api/vehicles/:id", updateVehicle);
  apiRouter.delete("/api/vehicles/:id", deleteVehicle);

  // Financing application routes
  apiRouter.post("/api/financing", createFinancingApplication);
  apiRouter.get("/api/financing", getFinancingApplications);
  apiRouter.get("/api/financing/:id", getFinancingApplicationById);

  // Test drive routes
  apiRouter.post("/api/test-drives", createTestDrive);
  apiRouter.get("/api/test-drives", getTestDrives);

  // Trade-in routes
  apiRouter.post("/api/trade-ins", createTradeIn);
  apiRouter.get("/api/trade-ins", getTradeIns);

  // User routes
  apiRouter.post("/api/users", createUser);
  apiRouter.post("/api/login", loginUser);

  const httpServer = createServer(app);
  return httpServer;
}