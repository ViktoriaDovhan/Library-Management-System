import * as z from "zod";

export const createLoanSchema = z.object({
    userId: z
        .string()
        .min(1, "User ID required")
        .max(100, "user id must be less than 100 characters"),
    bookId: z
        .string()
        .min(1, "Book ID required")
        .max(100, "book id must be less than 100 characters"),
});

export type CreateLoanDto = z.infer<typeof createLoanSchema>;