import { Router } from "express";
import { FinancingController } from "../controllers/financingController";

const router = Router();

// Financing application routes
router.post("/", FinancingController.createFinancingApplication);
router.get("/", FinancingController.getAllFinancingApplications);
router.get("/:id", FinancingController.getFinancingApplicationById);

export default router;