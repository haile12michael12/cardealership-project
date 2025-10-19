import { Router } from "express";
import { RecommendationController } from "../controllers/recommendationController";

const router = Router();

// Recommendation routes
router.post("/vehicles", RecommendationController.getRecommendations);
router.get("/personalized/:userId", RecommendationController.getPersonalizedRecommendations);

export default router;