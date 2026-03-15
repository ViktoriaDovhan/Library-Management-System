import { NextFunction, Request, Response } from "express";
import * as usersService from "../services/user.service";

export async function getUsers(
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const users = await usersService.getAllUsers();

        res.json({
            data: users,
        });
    } catch (error) {
        next(error);
    }
}

export async function getUser(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const user = await usersService.getUserById(req.params.id);

        res.json({
            data: user,
        });
    } catch (error) {
        next(error);
    }
}

export async function getMe(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const user = await usersService.getMe(req.user!.userId);

        res.json({
            data: user,
        });
    } catch (error) {
        next(error);
    }
}