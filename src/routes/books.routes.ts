import { Router } from "express";
import * as booksController from "../controllers/book.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { validate } from "../middleware/validate";
import { createBookSchema, updateBookSchema } from "../schemas/book.schema";

const router = Router();

router.get("/", booksController.getBooks);
router.get("/:id", booksController.getBook);
router.post(
    "/",
    requireAuth,
    requireRole("ADMIN"),
    validate(createBookSchema),
    booksController.createBook
);
router.put(
    "/:id",
    requireAuth,
    requireRole("ADMIN"),
    validate(updateBookSchema),
    booksController.updateBook
);
router.delete(
    "/:id",
    requireAuth,
    requireRole("ADMIN"),
    booksController.deleteBook
);

export default router;