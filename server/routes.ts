import { Router } from "express";
import vehicleRoutes from "./routes/vehicle.routes";
import userRoutes from "./routes/user.routes";
import financingRoutes from "./routes/financing.routes";
import testDriveRoutes from "./routes/testDrive.routes";
import tradeInRoutes from "./routes/tradeIn.routes";
import recommendationRoutes from "./routes/recommendation.routes";
import stockRoutes from "./routes/stock.routes";
import vinDecoderRoutes from "./routes/vinDecoder.routes";
import pricePredictionRoutes from "./routes/pricePrediction.routes";
import analyticsRoutes from "./routes/analytics.routes";

const router = Router();

// API routes
router.use("/api/vehicles", vehicleRoutes);
router.use("/api/users", userRoutes);
router.use("/api/financing", financingRoutes);
router.use("/api/test-drives", testDriveRoutes);
router.use("/api/trade-ins", tradeInRoutes);
router.use("/api/recommendations", recommendationRoutes);
router.use("/api/stock", stockRoutes);
router.use("/api/vin", vinDecoderRoutes);
router.use("/api/price-prediction", pricePredictionRoutes);
router.use("/api/analytics", analyticsRoutes);

export default router;