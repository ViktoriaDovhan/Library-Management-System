import { Router } from "express";
import * as usersController from "../controllers/user.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { uploadAvatar } from "../middleware/upload.middleware";

const router = Router();

router.get("/me", requireAuth, usersController.getMe);
router.post(
    "/me/avatar",
    requireAuth,
    uploadAvatar.single("avatar"),
    usersController.uploadAvatar
);
router.delete("/me/avatar", requireAuth, usersController.deleteAvatar);
router.get("/", requireAuth, requireRole("ADMIN"), usersController.getUsers);
router.get("/:id", requireAuth, requireRole("ADMIN"), usersController.getUser);

export default router;