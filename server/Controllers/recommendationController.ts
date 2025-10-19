import { Request, Response } from "express";
import { RecommendationService, UserPreferences } from "../services/recommendationService";
import { VehicleModel } from "../models/Vehicle";

export class RecommendationController {
  // Get vehicle recommendations based on preferences
  static async getRecommendations(req: Request, res: Response) {
    try {
      const preferences: UserPreferences = req.body;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      
      const vehicles = await RecommendationService.getRecommendations(preferences, limit);
      
      res.json(vehicles.map(vehicle => new VehicleModel(vehicle)));
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch recommendations" });
    }
  }

  // Get personalized recommendations for a user
  static async getPersonalizedRecommendations(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const vehicles = await RecommendationService.getPersonalizedRecommendations(userId, limit);
      
      res.json(vehicles.map(vehicle => new VehicleModel(vehicle)));
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch personalized recommendations" });
    }
  }
}