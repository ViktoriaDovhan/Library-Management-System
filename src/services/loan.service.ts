import { Role } from "@prisma/client";
import { prisma } from "../db/prisma";
import { AppError } from "../utils/app-error";
import { CreateLoanDto } from "../schemas/loan.schema";

type AuthUser = {
    userId: string;
    role: Role;
};

const loanInclude = {
    book: true,
    user: {
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
        },
    },
} as const;

export async function getLoans(authUser: AuthUser) {
    if (authUser.role === "ADMIN") {
        return prisma.loan.findMany({
            include: loanInclude,
            orderBy: { loanDate: "desc" },
        });
    }

    return prisma.loan.findMany({
        where: { userId: authUser.userId },
        include: loanInclude,
        orderBy: { loanDate: "desc" },
    });
}

export async function issueBook(data: CreateLoanDto, authUser: AuthUser) {
    const targetUserId =
        authUser.role === "ADMIN" && data.userId
            ? data.userId
            : authUser.userId;

    const user = await prisma.user.findUnique({
        where: { id: targetUserId },
    });

    if (!user) {
        throw new AppError(404, "User not found");
    }

    const book = await prisma.book.findUnique({
        where: { id: data.bookId },
    });

    if (!book) {
        throw new AppError(404, "Book not found");
    }

    if (!book.available) {
        throw new AppError(400, "Book not available");
    }

    const existingActiveLoan = await prisma.loan.findFirst({
        where: {
            bookId: data.bookId,
            status: "ACTIVE",
        },
    });

    if (existingActiveLoan) {
        throw new AppError(400, "Book already loaned");
    }

    return prisma.$transaction(async (tx) => {
        const loan = await tx.loan.create({
            data: {
                userId: targetUserId,
                bookId: data.bookId,
            },
            include: loanInclude,
        });

        await tx.book.update({
            where: { id: data.bookId },
            data: { available: false },
        });

        return loan;
    });
}

export async function returnBook(id: string, authUser: AuthUser) {
    const loan = await prisma.loan.findUnique({
        where: { id },
    });

    if (!loan || loan.status !== "ACTIVE") {
        throw new AppError(404, "Active loan not found");
    }

    if (authUser.role !== "ADMIN" && loan.userId !== authUser.userId) {
        throw new AppError(403, "Forbidden");
    }

    return prisma.$transaction(async (tx) => {
        const updatedLoan = await tx.loan.update({
            where: { id },
            data: {
                status: "RETURNED",
                returnDate: new Date(),
            },
            include: loanInclude,
        });

        await tx.book.update({
            where: { id: loan.bookId },
            data: { available: true },
        });

        return updatedLoan;
    });
}