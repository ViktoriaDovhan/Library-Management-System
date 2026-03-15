import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { AppError } from "../utils/app-error";

export function errorHandler(
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            error: err.message,
        });
    }

    if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
    ) {
        return res.status(400).json({
            error: "Unique field already exists",
        });
    }

    if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2003"
    ) {
        return res.status(400).json({
            error: "Cannot delete record because related data exists",
        });
    }

    if (err instanceof SyntaxError) {
        return res.status(400).json({
            error: "Invalid JSON",
        });
    }

    console.error(err);

    return res.status(500).json({
        error: "Internal server error",
    });
}