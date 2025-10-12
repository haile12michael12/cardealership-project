import { Request, Response } from "express";
import { storage } from "../Models/storage";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { insertFinancingApplicationSchema } = require("../shared/validation-schema.cjs");

import { z } from "zod";

// Create a new financing application
export async function createFinancingApplication(req: Request, res: Response) {
  try {
    const applicationData = insertFinancingApplicationSchema.parse(req.body);
    const application = await storage.createFinancingApplication(applicationData);
    res.status(201).json(application);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid application data", errors: error.errors });
    }
    res.status(500).json({ message: "Failed to submit financing application" });
  }
}

// Get all financing applications
export async function getFinancingApplications(req: Request, res: Response) {
  try {
    const applications = await storage.getFinancingApplications();
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch financing applications" });
  }
}

// Get a specific financing application by ID
export async function getFinancingApplicationById(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const application = await storage.getFinancingApplication(id);
    
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch financing application" });
  }
}