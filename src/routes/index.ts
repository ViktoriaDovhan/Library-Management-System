import { Router } from "express";
import authRoutes from "./auth.routes";
import booksRoutes from "./books.routes";
import usersRoutes from "./users.routes";
import loansRoutes from "./loans.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/books", booksRoutes);
router.use("/users", usersRoutes);
router.use("/loans", loansRoutes);

export default router;