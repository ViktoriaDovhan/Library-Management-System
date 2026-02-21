import { loans, books, users } from "../storage/data";
import { Loan } from "../types";
import { v4 as uuid } from "uuid";
import { CreateLoanDto } from "../schemas/loan.schema";

export const getAllLoans = (): Loan[] => loans;

export const issueBook = (data: CreateLoanDto): Loan | string => {
    const { userId, bookId } = data;

    const user = users.find(u => u.id === userId);
    if (!user) return "User not found";

    const book = books.find(b => b.id === bookId);
    if (!book) return "Book not found";

    if (!book.available) return "Book not available";
    if (loans.find(l => l.bookId === bookId && l.status === "ACTIVE")) return "Book already loaned";

    const loan: Loan = {
        id: uuid(),
        userId,
        bookId,
        loanDate: new Date(),
        returnDate: null,
        status: "ACTIVE",
    };

    book.available = false;
    loans.push(loan);
    return loan;
};

export const returnBook = (id: string): Loan | string => {
    const loan = loans.find(l => l.id === id && l.status === "ACTIVE");
    if (!loan) return "Active loan not found";

    const book = books.find(b => b.id === loan.bookId);
    if (book) book.available = true;

    loan.status = "RETURNED";
    loan.returnDate = new Date();

    return loan;
};