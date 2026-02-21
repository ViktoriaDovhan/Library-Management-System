import * as z from "zod";

export const createUserSchema = z.object({
    name: z
        .string()
        .min(1, "Name is required")
        .max(100, "Name must be less than 100 characters"),
    email: z
        .email("Invalid email address")
})

export type CreateUserDto = z.infer<typeof createUserSchema>;