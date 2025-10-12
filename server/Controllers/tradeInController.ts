import { Request, Response } from "express";
import { storage } from "../Models/storage";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { insertTradeInSchema } = require("../shared/validation-schema.cjs");

import { z } from "zod";

// Create a new trade-in
export async function createTradeIn(req: Request, res: Response) {
  try {
    const tradeInData = insertTradeInSchema.parse(req.body);
    const tradeIn = await storage.createTradeIn(tradeInData);
    res.status(201).json(tradeIn);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid trade-in data", errors: error.errors });
    }
    res.status(500).json({ message: "Failed to submit trade-in request" });
  }
}

// Get all trade-ins
export async function getTradeIns(req: Request, res: Response) {
  try {
    const tradeIns = await storage.getTradeIns();
    res.json(tradeIns);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch trade-ins" });
  }
}