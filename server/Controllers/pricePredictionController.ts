import { Request, Response } from "express";
import { PricePredictionService } from "../services/pricePredictionService";

export class PricePredictionController {
  // Predict price for a vehicle
  static async predictPrice(req: Request, res: Response) {
    try {
      const vehicleSpecs = req.body;
      
      if (!vehicleSpecs) {
        return res.status(400).json({ message: "Vehicle specifications are required" });
      }
      
      const prediction = await PricePredictionService.predictPrice(vehicleSpecs);
      
      res.json(prediction);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to predict price", error: error.message });
    }
  }
  
  // Get price history for similar vehicles
  static async getPriceHistory(req: Request, res: Response) {
    try {
      const vehicleSpecs = req.body;
      
      if (!vehicleSpecs) {
        return res.status(400).json({ message: "Vehicle specifications are required" });
      }
      
      const history = await PricePredictionService.getPriceHistory(vehicleSpecs);
      
      res.json(history);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to get price history", error: error.message });
    }
  }
  
  // Get comparable vehicles
  static async getComparableVehicles(req: Request, res: Response) {
    try {
      const vehicleSpecs = req.body;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      
      if (!vehicleSpecs) {
        return res.status(400).json({ message: "Vehicle specifications are required" });
      }
      
      const comparables = await PricePredictionService.getComparableVehicles(vehicleSpecs, limit);
      
      res.json(comparables);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to get comparable vehicles", error: error.message });
    }
  }
}