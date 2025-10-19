import { Router } from "express";
import { VinDecoderController } from "../controllers/vinDecoderController";

const router = Router();

// VIN decoder routes
router.post("/decode", VinDecoderController.decodeVin);
router.get("/:vin", VinDecoderController.getVehicleByVin);

export default router;