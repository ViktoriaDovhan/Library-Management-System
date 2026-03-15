import { NextFunction, Request, Response } from "express";
import * as authService from "../services/auth.service";
import { LoginDto, RegisterDto } from "../schemas/auth.schema";

export async function register(
    req: Request<{}, {}, RegisterDto>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const result = await authService.register(req.body);

        res.status(201).json({
            data: result,
        });
    } catch (error) {
        next(error);
    }
}

export async function login(
    req: Request<{}, {}, LoginDto>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const result = await authService.login(req.body);

        res.json({
            data: result,
        });
    } catch (error) {
        next(error);
    }
}