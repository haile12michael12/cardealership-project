import { Request, Response } from "express";
import { VinDecoderService } from "../services/vinDecoderService";

export class VinDecoderController {
  // Decode a VIN number
  static async decodeVin(req: Request, res: Response) {
    try {
      const { vin } = req.body;
      
      if (!vin) {
        return res.status(400).json({ message: "VIN is required" });
      }
      
      // Validate VIN format
      if (vin.length !== 17) {
        return res.status(400).json({ message: "Invalid VIN format. VIN must be 17 characters long." });
      }
      
      const vehicleSpecs = await VinDecoderService.decodeVin(vin);
      
      res.json(vehicleSpecs);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to decode VIN", error: error.message });
    }
  }
  
  // Get vehicle specs by VIN (GET request)
  static async getVehicleByVin(req: Request, res: Response) {
    try {
      const { vin } = req.params;
      
      if (!vin) {
        return res.status(400).json({ message: "VIN is required" });
      }
      
      // Validate VIN format
      if (vin.length !== 17) {
        return res.status(400).json({ message: "Invalid VIN format. VIN must be 17 characters long." });
      }
      
      const vehicleSpecs = await VinDecoderService.decodeVin(vin);
      
      res.json(vehicleSpecs);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to decode VIN", error: error.message });
    }
  }
}