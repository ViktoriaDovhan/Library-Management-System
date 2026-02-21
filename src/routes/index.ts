import { Router } from "express";
import * as bookController from "../controllers/book.controller";
import * as userController from "../controllers/user.controller";
import * as loanController from "../controllers/loan.controller";

import { validate } from "../middleware/validate";
import { createBookSchema, updateBookSchema } from "../schemas/book.schema";
import { createUserSchema } from "../schemas/user.schema";
import { createLoanSchema } from "../schemas/loan.schema";

const router = Router();

router.get("/books", bookController.getBooks);
router.get("/books/:id", bookController.getBook);
router.post("/books", validate(createBookSchema), bookController.createBook);
router.put("/books/:id", validate(updateBookSchema), bookController.updateBook);
router.delete("/books/:id", bookController.deleteBook);

router.get("/users", userController.getUsers);
router.get("/users/:id", userController.getUser);
router.post("/users", validate(createUserSchema), userController.createUser);

router.get("/loans", loanController.getLoans);
router.post("/loans", validate(createLoanSchema), loanController.issueBook);
router.post("/loans/:id/return", loanController.returnBook);

export default router;