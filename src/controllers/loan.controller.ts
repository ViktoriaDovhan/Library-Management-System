import { NextFunction, Request, Response } from "express";
import * as loansService from "../services/loan.service";
import { CreateLoanDto } from "../schemas/loan.schema";

export async function getLoans(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const loans = await loansService.getLoans({
            userId: req.user!.userId,
            role: req.user!.role,
        });

        res.json({
            data: loans,
        });
    } catch (error) {
        next(error);
    }
}

export async function issueBook(
    req: Request<{}, {}, CreateLoanDto>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const loan = await loansService.issueBook(req.body, {
            userId: req.user!.userId,
            role: req.user!.role,
        });

        res.status(201).json({
            data: loan,
        });
    } catch (error) {
        next(error);
    }
}

export async function returnBook(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const loan = await loansService.returnBook(req.params.id, {
            userId: req.user!.userId,
            role: req.user!.role,
        });

        res.json({
            data: loan,
        });
    } catch (error) {
        next(error);
    }
}