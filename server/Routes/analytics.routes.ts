import { Router } from "express";
import { AnalyticsController } from "../controllers/analyticsController";

const router = Router();

// Analytics routes
router.get("/", AnalyticsController.getAnalytics);
router.get("/real-time", AnalyticsController.getRealTimeAnalytics);

export default router;