import { Router } from "express";
import * as loansController from "../controllers/loan.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate";
import { createLoanSchema } from "../schemas/loan.schema";

const router = Router();

router.get("/", requireAuth, loansController.getLoans);
router.post("/", requireAuth, validate(createLoanSchema), loansController.issueBook);
router.post("/:id/return", requireAuth, loansController.returnBook);

export default router;