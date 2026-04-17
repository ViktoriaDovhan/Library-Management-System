import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { validate } from "../middleware/validate";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
import {
    requestPasswordResetSchema,
    resetPasswordSchema,
} from "../schemas/password-reset.schema";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post(
    "/request-password-reset",
    validate(requestPasswordResetSchema),
    authController.requestPasswordReset
);
router.post(
    "/reset-password",
    validate(resetPasswordSchema),
    authController.resetPassword
);

export default router;