import { Request, Response } from "express";
import { storage } from "../storage";
import { insertFinancingApplicationSchema } from "../schema";
import { z } from "zod";
import { FinancingApplicationModel } from "../models/FinancingApplication";

export class FinancingController {
  // Create a new financing application
  static async createFinancingApplication(req: Request, res: Response) {
    try {
      const applicationData = insertFinancingApplicationSchema.parse(req.body);
      const application = await storage.createFinancingApplication(applicationData);
      res.status(201).json(new FinancingApplicationModel(application));
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid application data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to submit financing application" });
    }
  }

  // Get all financing applications
  static async getAllFinancingApplications(req: Request, res: Response) {
    try {
      const applications = await storage.getFinancingApplications();
      res.json(applications.map(app => new FinancingApplicationModel(app)));
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch financing applications" });
    }
  }

  // Get a specific financing application by ID
  static async getFinancingApplicationById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const application = await storage.getFinancingApplication(id);
      
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      
      res.json(new FinancingApplicationModel(application));
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch financing application" });
    }
  }
}