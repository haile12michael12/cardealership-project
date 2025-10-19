import { Router } from "express";
import { TestDriveController } from "../controllers/testDriveController";

const router = Router();

// Test drive routes
router.post("/", TestDriveController.createTestDrive);
router.get("/", TestDriveController.getAllTestDrives);
router.get("/:id", TestDriveController.getTestDriveById);

export default router;