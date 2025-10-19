import { Router } from "express";
import { TradeInController } from "../controllers/tradeInController";

const router = Router();

// Trade-in routes
router.post("/", TradeInController.createTradeIn);
router.get("/", TradeInController.getAllTradeIns);
router.get("/:id", TradeInController.getTradeInById);

export default router;