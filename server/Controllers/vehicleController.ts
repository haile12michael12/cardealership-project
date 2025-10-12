import { Request, Response } from "express";
import { storage } from "../Models/storage";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { insertVehicleSchema } = require("../shared/validation-schema.cjs");

import { z } from "zod";

// Get all vehicles with optional filtering
export async function getVehicles(req: Request, res: Response) {
  try {
    // Extract query parameters for filtering
    const { make, model, bodyType, minPrice, maxPrice, featured } = req.query;
    
    let filters: any = {};
    
    if (make) filters.make = make as string;
    if (model) filters.model = model as string;
    if (bodyType) filters.bodyType = bodyType as string;
    
    // Handle price range
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.min = parseInt(minPrice as string);
      if (maxPrice) filters.price.max = parseInt(maxPrice as string);
    }
    
    let vehicles;
    
    // Get featured vehicles only if specified
    if (featured === 'true') {
      vehicles = await storage.getFeaturedVehicles();
    } else {
      vehicles = await storage.getVehicles(filters);
    }
    
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch vehicles" });
  }
}

// Get a specific vehicle by ID
export async function getVehicleById(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const vehicle = await storage.getVehicle(id);
    
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch vehicle" });
  }
}

// Create a new vehicle
export async function createVehicle(req: Request, res: Response) {
  try {
    const vehicleData = insertVehicleSchema.parse(req.body);
    const vehicle = await storage.createVehicle(vehicleData);
    res.status(201).json(vehicle);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid vehicle data", errors: error.errors });
    }
    res.status(500).json({ message: "Failed to create vehicle" });
  }
}

// Update a vehicle by ID
export async function updateVehicle(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const vehicle = await storage.getVehicle(id);
    
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    
    const updatedVehicle = await storage.updateVehicle(id, req.body);
    res.json(updatedVehicle);
  } catch (error) {
    res.status(500).json({ message: "Failed to update vehicle" });
  }
}

// Delete a vehicle by ID
export async function deleteVehicle(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const vehicle = await storage.getVehicle(id);
    
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    
    await storage.deleteVehicle(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Failed to delete vehicle" });
  }
}