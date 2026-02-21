import { Request, Response } from "express";
import * as loanService from "../services/loan.service";
import { CreateLoanDto } from "../schemas/loan.schema";

type ParamsWithId = { id: string };

export const getLoans = (req: Request, res: Response) => {
    res.json(loanService.getAllLoans());
};

export const issueBook = (req: Request<{}, {}, CreateLoanDto>, res: Response) => {
    const result = loanService.issueBook(req.body);
    if (typeof result === "string") return res.status(400).json({ message: result });

    res.status(201).json(result);
};

export const returnBook = (req: Request<ParamsWithId>, res: Response) => {
    const result = loanService.returnBook(req.params.id);
    if (typeof result === "string") return res.status(400).json({ message: result });

    res.json(result);
};