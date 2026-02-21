import { books } from "../storage/data";
import { Book } from "../types";
import { v4 as uuid } from "uuid";
import { CreateBookDto, UpdateBookDto } from "../schemas/book.schema";

export const getAllBooks = (): Book[] => books;

export const getBookById = (id: string): Book | undefined =>
    books.find(b => b.id === id);

export const createBook = (data: CreateBookDto): Book => {
    const book: Book = {
        id: uuid(),
        title: data.title,
        author: data.author,
        year: data.year,
        isbn: data.isbn,
        available: true,
    };
    books.push(book);
    return book;
};

export const updateBook = (id: string, data: UpdateBookDto): Book | undefined => {
    const book = getBookById(id);
    if (!book) return undefined;

    book.title = data.title ?? book.title;
    book.author = data.author ?? book.author;
    book.year = data.year ?? book.year;
    book.isbn = data.isbn ?? book.isbn;
    book.available = data.available ?? book.available;

    return book;
};

export const deleteBook = (id: string): boolean => {
    const index = books.findIndex(b => b.id === id);
    if (index === -1) return false;
    books.splice(index, 1);
    return true;
};

const generateIsbn = (): string => {
    let isbn = "978";
    for (let i = 0; i < 10; i++) {
        isbn += Math.floor(Math.random() * 10);
    }
    if (books.some(b => b.isbn === isbn)) return generateIsbn();
    return isbn;
};