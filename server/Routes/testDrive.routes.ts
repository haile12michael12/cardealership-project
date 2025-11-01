import { Router } from "express";
import { TestDriveController } from "../controllers/testDriveController";

const router = Router();

// Test drive routes
router.post("/", TestDriveController.createTestDrive);
router.get("/", TestDriveController.getAllTestDrives);
router.get("/:id", TestDriveController.getTestDriveById);
router.get("/availability", TestDriveController.checkAvailability);

export default router;