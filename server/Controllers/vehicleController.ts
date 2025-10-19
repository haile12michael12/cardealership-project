import { Request, Response } from "express";
import { storage } from "../storage";
import { insertVehicleSchema } from "../schema";
import { z } from "zod";
import { VehicleModel } from "../models/Vehicle";

export class VehicleController {
  // Get all vehicles with enhanced filtering
  static async getAllVehicles(req: Request, res: Response) {
    try {
      // Extract query parameters for filtering
      const { 
        make, 
        model, 
        bodyType, 
        fuelType,
        transmission,
        minPrice, 
        maxPrice, 
        minYear,
        maxYear,
        minMileage,
        maxMileage,
        featured,
        sortBy,
        sortOrder
      } = req.query;
      
      let filters: any = {};
      
      // Text filters
      if (make) filters.make = make as string;
      if (model) filters.model = model as string;
      if (bodyType) filters.bodyType = bodyType as string;
      if (transmission) filters.transmission = transmission as string;
      
      // Fuel type filter (support multiple)
      if (fuelType) {
        const fuelTypes = (fuelType as string).split(',');
        if (fuelTypes.length > 1) {
          filters.fuelType = fuelTypes;
        } else {
          filters.fuelType = fuelType as string;
        }
      }
      
      // Price range filter
      if (minPrice || maxPrice) {
        filters.price = {};
        if (minPrice) filters.price.min = parseInt(minPrice as string);
        if (maxPrice) filters.price.max = parseInt(maxPrice as string);
      }
      
      // Year range filter
      if (minYear || maxYear) {
        filters.year = {};
        if (minYear) filters.year.min = parseInt(minYear as string);
        if (maxYear) filters.year.max = parseInt(maxYear as string);
      }
      
      // Mileage range filter
      if (minMileage || maxMileage) {
        filters.mileage = {};
        if (minMileage) filters.mileage.min = parseInt(minMileage as string);
        if (maxMileage) filters.mileage.max = parseInt(maxMileage as string);
      }
      
      let vehicles;
      
      // Get featured vehicles only if specified
      if (featured === 'true') {
        vehicles = await storage.getFeaturedVehicles();
      } else {
        vehicles = await storage.getVehicles(filters);
      }
      
      // Apply sorting if specified
      if (sortBy) {
        const order = sortOrder === 'desc' ? -1 : 1;
        vehicles.sort((a, b) => {
          // @ts-ignore
          if (a[sortBy] < b[sortBy]) return -1 * order;
          // @ts-ignore
          if (a[sortBy] > b[sortBy]) return 1 * order;
          return 0;
        });
      }
      
      res.json(vehicles.map(vehicle => new VehicleModel(vehicle)));
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch vehicles" });
    }
  }

  // Get a specific vehicle by ID
  static async getVehicleById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const vehicle = await storage.getVehicle(id);
      
      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      
      res.json(new VehicleModel(vehicle));
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch vehicle" });
    }
  }

  // Create a new vehicle
  static async createVehicle(req: Request, res: Response) {
    try {
      const vehicleData = insertVehicleSchema.parse(req.body);
      const vehicle = await storage.createVehicle(vehicleData);
      res.status(201).json(new VehicleModel(vehicle));
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid vehicle data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create vehicle" });
    }
  }

  // Update a vehicle
  static async updateVehicle(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const vehicle = await storage.getVehicle(id);
      
      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      
      const updatedVehicle = await storage.updateVehicle(id, req.body);
      res.json(new VehicleModel(updatedVehicle!));
    } catch (error: any) {
      res.status(500).json({ message: "Failed to update vehicle" });
    }
  }

  // Delete a vehicle
  static async deleteVehicle(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const vehicle = await storage.getVehicle(id);
      
      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      
      await storage.deleteVehicle(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: "Failed to delete vehicle" });
    }
  }
}