import { Router } from "express";
import { StockController } from "../controllers/stockController";

const router = Router();

// Stock management routes
router.put("/:vehicleId/status", StockController.updateStockStatus);
router.post("/:vehicleId/reserve", StockController.reserveVehicle);
router.post("/:vehicleId/release", StockController.releaseReservation);
router.post("/:vehicleId/sold", StockController.markAsSold);

export default router;