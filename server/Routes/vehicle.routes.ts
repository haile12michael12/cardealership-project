import { Router } from "express";
import { VehicleController } from "../controllers/vehicleController";

const router = Router();

// Vehicle routes
router.get("/", VehicleController.getAllVehicles);
router.get("/:id", VehicleController.getVehicleById);
router.post("/", VehicleController.createVehicle);
router.put("/:id", VehicleController.updateVehicle);
router.delete("/:id", VehicleController.deleteVehicle);

export default router;