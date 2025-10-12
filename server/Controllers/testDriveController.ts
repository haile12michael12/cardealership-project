import { Request, Response } from "express";
import { storage } from "../Models/storage";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { insertTestDriveSchema } = require("../shared/validation-schema.cjs");

import { z } from "zod";

// Create a new test drive
export async function createTestDrive(req: Request, res: Response) {
  try {
    const testDriveData = insertTestDriveSchema.parse(req.body);
    const testDrive = await storage.createTestDrive(testDriveData);
    res.status(201).json(testDrive);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid test drive data", errors: error.errors });
    }
    res.status(500).json({ message: "Failed to schedule test drive" });
  }
}

// Get all test drives
export async function getTestDrives(req: Request, res: Response) {
  try {
    const testDrives = await storage.getTestDrives();
    res.json(testDrives);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch test drives" });
  }
}