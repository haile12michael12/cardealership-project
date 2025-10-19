import { Router } from "express";
import { UserController } from "../controllers/userController";

const router = Router();

// User routes
router.post("/", UserController.createUser);
router.post("/login", UserController.loginUser);

export default router;