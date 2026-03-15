import type { NextFunction, Request, Response } from "express";
import type { ZodTypeAny } from "zod";

export function validate(schema: ZodTypeAny) {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                error: "Validation error",
                details: result.error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message,
                })),
            });
        }

        req.body = result.data;
        next();
    };
}