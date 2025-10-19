import { Request, Response } from "express";
import { AnalyticsService } from "../services/analyticsService";

export class AnalyticsController {
  // Get comprehensive analytics data
  static async getAnalytics(req: Request, res: Response) {
    try {
      const analyticsData = await AnalyticsService.getAnalyticsData();
      res.json(analyticsData);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch analytics data", error: error.message });
    }
  }
  
  // Get real-time analytics data
  static async getRealTimeAnalytics(req: Request, res: Response) {
    try {
      const realTimeData = await AnalyticsService.getRealTimeAnalytics();
      res.json(realTimeData);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch real-time analytics", error: error.message });
    }
  }
}