import { Request, Response } from "express";
import { storage } from "../storage";
import { insertTradeInSchema } from "../schema";
import { z } from "zod";
import { TradeInModel } from "../models/TradeIn";

export class TradeInController {
  // Create a new trade-in request
  static async createTradeIn(req: Request, res: Response) {
    try {
      const tradeInData = insertTradeInSchema.parse(req.body);
      const tradeIn = await storage.createTradeIn(tradeInData);
      res.status(201).json(new TradeInModel(tradeIn));
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid trade-in data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to submit trade-in request" });
    }
  }

  // Get all trade-ins
  static async getAllTradeIns(req: Request, res: Response) {
    try {
      const tradeIns = await storage.getTradeIns();
      res.json(tradeIns.map(tradeIn => new TradeInModel(tradeIn)));
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch trade-ins" });
    }
  }

  // Get a specific trade-in by ID
  static async getTradeInById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const tradeIn = await storage.getTradeIn(id);
      
      if (!tradeIn) {
        return res.status(404).json({ message: "Trade-in not found" });
      }
      
      res.json(new TradeInModel(tradeIn));
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch trade-in" });
    }
  }
}