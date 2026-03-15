import { prisma } from "../db/prisma";
import { AppError } from "../utils/app-error";
import { CreateBookDto, UpdateBookDto } from "../schemas/book.schema";
import { Prisma } from "@prisma/client";

export async function getAllBooks() {
    return prisma.book.findMany({
        orderBy: { title: "asc" },
    });
}

export async function getBookById(id: string) {
    const book = await prisma.book.findUnique({
        where: { id },
    });

    if (!book) {
        throw new AppError(404, "Book not found");
    }

    return book;
}

export async function createBook(data: CreateBookDto) {
    return prisma.book.create({
        data: {
            ...data,
            available: true,
        },
    });
}

export async function updateBook(id: string, data: UpdateBookDto) {
    await getBookById(id);

    const updateData: Prisma.BookUpdateInput = {};

    if (data.title !== undefined) {
        updateData.title = data.title;
    }

    if (data.author !== undefined) {
        updateData.author = data.author;
    }

    if (data.year !== undefined) {
        updateData.year = data.year;
    }

    if (data.isbn !== undefined) {
        updateData.isbn = data.isbn;
    }

    if (data.available !== undefined) {
        updateData.available = data.available;
    }

    return prisma.book.update({
        where: { id },
        data: updateData,
    });
}

export async function deleteBook(id: string) {
    await getBookById(id);

    const activeLoan = await prisma.loan.findFirst({
        where: {
            bookId: id,
            status: "ACTIVE",
        },
    });

    if (activeLoan) {
        throw new AppError(400, "Cannot delete a book with an active loan");
    }

    return prisma.$transaction(async (tx) => {
        await tx.loan.deleteMany({
            where: {
                bookId: id,
                status: "RETURNED",
            },
        });

        await tx.book.delete({
            where: { id },
        });

        return { message: "Book deleted successfully" };
    });
}