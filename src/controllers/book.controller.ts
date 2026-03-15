import { NextFunction, Request, Response } from "express";
import * as booksService from "../services/book.service";
import { CreateBookDto, UpdateBookDto } from "../schemas/book.schema";

export async function getBooks(
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const books = await booksService.getAllBooks();

        res.json({
            data: books,
        });
    } catch (error) {
        next(error);
    }
}

export async function getBook(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const book = await booksService.getBookById(req.params.id);

        res.json({
            data: book,
        });
    } catch (error) {
        next(error);
    }
}

export async function createBook(
    req: Request<{}, {}, CreateBookDto>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const book = await booksService.createBook(req.body);

        res.status(201).json({
            data: book,
        });
    } catch (error) {
        next(error);
    }
}

export async function updateBook(
    req: Request<{ id: string }, {}, UpdateBookDto>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const book = await booksService.updateBook(req.params.id, req.body);

        res.json({
            data: book,
        });
    } catch (error) {
        next(error);
    }
}

export async function deleteBook(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        await booksService.deleteBook(req.params.id);

        res.json({
            message: "Book deleted successfully",
        });
    } catch (error) {
        next(error);
    }
}