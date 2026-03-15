import { Router } from "express";
import * as usersController from "../controllers/user.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";

const router = Router();

router.get("/me", requireAuth, usersController.getMe);
router.get("/", requireAuth, requireRole("ADMIN"), usersController.getUsers);
router.get("/:id", requireAuth, requireRole("ADMIN"), usersController.getUser);

export default router;