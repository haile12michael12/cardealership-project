import { Router } from "express";
import { PricePredictionController } from "../controllers/pricePredictionController";

const router = Router();

// Price prediction routes
router.post("/predict", PricePredictionController.predictPrice);
router.post("/history", PricePredictionController.getPriceHistory);
router.post("/comparables", PricePredictionController.getComparableVehicles);

export default router;