import { prisma } from "../db/prisma";
import { AppError } from "../utils/app-error";

const safeUserSelect = {
    id: true,
    email: true,
    name: true,
    role: true,
} as const;

export async function getAllUsers() {
    return prisma.user.findMany({
        select: safeUserSelect,
        orderBy: { name: "asc" },
    });
}

export async function getUserById(id: string) {
    const user = await prisma.user.findUnique({
        where: { id },
        select: safeUserSelect,
    });

    if (!user) {
        throw new AppError(404, "User not found");
    }

    return user;
}

export async function getMe(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: safeUserSelect,
    });

    if (!user) {
        throw new AppError(404, "User not found");
    }

    return user;
}