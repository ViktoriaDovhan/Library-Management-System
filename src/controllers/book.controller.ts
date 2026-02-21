import { Request, Response } from "express";
import * as bookService from "../services/book.service";
import { CreateBookDto, UpdateBookDto } from "../schemas/book.schema";

type ParamsWithId = { id: string };

export const getBooks = (req: Request, res: Response) => {
    res.json(bookService.getAllBooks());
};

export const getBook = (req: Request<ParamsWithId>, res: Response) => {
    const book = bookService.getBookById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    res.json(book);
};

export const createBook = (req: Request<{}, {}, CreateBookDto>, res: Response) => {
    const book = bookService.createBook(req.body);
    res.status(201).json(book);
};

export const updateBook = (req: Request<ParamsWithId, {}, UpdateBookDto>, res: Response) => {
    const updatedBook = bookService.updateBook(req.params.id, req.body);
    if (!updatedBook) return res.status(404).json({ message: "Book not found" });

    res.json(updatedBook);
};

export const deleteBook = (req: Request<ParamsWithId>, res: Response) => {
    const success = bookService.deleteBook(req.params.id);
    if (!success) return res.status(404).json({ message: "Book not found" });

    res.status(204).end();
};