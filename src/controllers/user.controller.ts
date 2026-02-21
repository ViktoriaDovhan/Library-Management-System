import { Request, Response } from "express";
import * as userService from "../services/user.service";
import { CreateUserDto } from "../schemas/user.schema";

type ParamsWithId = { id: string };

export const getUsers = (req: Request, res: Response) => {
    res.json(userService.getAllUsers());
};

export const getUser = (req: Request<ParamsWithId>, res: Response) => {
    const user = userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
};

export const createUser = (req: Request<{}, {}, CreateUserDto>, res: Response) => {
    const user = userService.createUser(req.body);
    res.status(201).json(user);
};