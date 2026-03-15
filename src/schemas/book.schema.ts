import * as z from "zod";

const currentYear = new Date().getFullYear();

export const createBookSchema = z.object({
    title: z
        .string()
        .min(1, "Title is required")
        .max(100, "Title must be less than 100 characters"),
    author: z
        .string()
        .min(1, "Author is required")
        .max(100, "Author must be less than 100 characters"),
    year: z
        .number().int().positive()
        .max(currentYear, "Year can't be in the future"),
    isbn: z
        .string()
        .regex(/^\d{13}$/, "ISBN must contain 13 digits")
})

export const updateBookSchema = z.object({
    title: z
        .string()
        .min(1, "Title is required")
        .max(100, "Title must be less than 100 characters")
        .optional(),
    author: z
        .string()
        .min(1, "Author is required")
        .max(100, "Author must be less than 100 characters")
        .optional(),
    year: z
        .number().int().positive()
        .max(currentYear, "Year can't be in the future")
        .optional(),
    available: z
        .boolean()
        .optional(),
    isbn: z
        .string()
        .regex(/^\d{13}$/, "ISBN must contain 13 digits")
        .optional()
})

export type CreateBookDto = z.infer<typeof createBookSchema>;
export type UpdateBookDto = z.infer<typeof updateBookSchema>;