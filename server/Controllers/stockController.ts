import { Request, Response } from "express";
import { StockService } from "../services/stockService";

export class StockController {
  // Update vehicle stock status
  static async updateStockStatus(req: Request, res: Response) {
    try {
      const { vehicleId } = req.params;
      const { status } = req.body;
      
      if (!vehicleId || !status) {
        return res.status(400).json({ message: "Vehicle ID and status are required" });
      }
      
      const updatedVehicle = await StockService.updateStockStatus(
        parseInt(vehicleId),
        status
      );
      
      if (!updatedVehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      
      res.json(updatedVehicle);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to update stock status" });
    }
  }
  
  // Reserve a vehicle
  static async reserveVehicle(req: Request, res: Response) {
    try {
      const { vehicleId } = req.params;
      const { customerId, duration } = req.body;
      
      if (!vehicleId || !customerId) {
        return res.status(400).json({ message: "Vehicle ID and customer ID are required" });
      }
      
      const updatedVehicle = await StockService.reserveVehicle(
        parseInt(vehicleId),
        parseInt(customerId),
        duration
      );
      
      if (!updatedVehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      
      res.json(updatedVehicle);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to reserve vehicle" });
    }
  }
  
  // Release a vehicle reservation
  static async releaseReservation(req: Request, res: Response) {
    try {
      const { vehicleId } = req.params;
      
      if (!vehicleId) {
        return res.status(400).json({ message: "Vehicle ID is required" });
      }
      
      const updatedVehicle = await StockService.releaseReservation(
        parseInt(vehicleId)
      );
      
      if (!updatedVehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      
      res.json(updatedVehicle);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to release reservation" });
    }
  }
  
  // Mark a vehicle as sold
  static async markAsSold(req: Request, res: Response) {
    try {
      const { vehicleId } = req.params;
      const { customerId } = req.body;
      
      if (!vehicleId || !customerId) {
        return res.status(400).json({ message: "Vehicle ID and customer ID are required" });
      }
      
      const updatedVehicle = await StockService.markAsSold(
        parseInt(vehicleId),
        parseInt(customerId)
      );
      
      if (!updatedVehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      
      res.json(updatedVehicle);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to mark vehicle as sold" });
    }
  }
}