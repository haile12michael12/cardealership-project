import { Request, Response } from "express";
import { storage } from "../storage";
import { insertTestDriveSchema } from "../schema";
import { z } from "zod";
import { TestDriveModel } from "../models/TestDrive";

export class TestDriveController {
  // Create a new test drive
  static async createTestDrive(req: Request, res: Response) {
    try {
      const testDriveData = insertTestDriveSchema.parse(req.body);
      const testDrive = await storage.createTestDrive(testDriveData);
      res.status(201).json(new TestDriveModel(testDrive));
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid test drive data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to schedule test drive" });
    }
  }

  // Get all test drives
  static async getAllTestDrives(req: Request, res: Response) {
    try {
      const testDrives = await storage.getTestDrives();
      res.json(testDrives.map(testDrive => new TestDriveModel(testDrive)));
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch test drives" });
    }
  }

  // Get a specific test drive by ID
  static async getTestDriveById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const testDrive = await storage.getTestDrive(id);
      
      if (!testDrive) {
        return res.status(404).json({ message: "Test drive not found" });
      }
      
      res.json(new TestDriveModel(testDrive));
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch test drive" });
    }
  }
}