import { z } from "zod";

export const requestPasswordResetSchema = z.object({
    email: z.string().trim().email("Invalid email"),
});

export const resetPasswordSchema = z.object({
    token: z.string().trim().min(1, "Token is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export type RequestPasswordResetDto = z.infer<typeof requestPasswordResetSchema>;
export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;