import fs from "fs";
import path from "path";
import type { Express } from "express";
import { prisma } from "../db/prisma";
import { AppError } from "../utils/app-error";

const safeUserSelect = {
    id: true,
    email: true,
    name: true,
    role: true,
    avatarUrl: true,
} as const;

async function deleteAvatarFile(avatarUrl: string | null) {
    if (!avatarUrl) {
        return;
    }

    const filePath = path.join(process.cwd(), avatarUrl.replace(/^\//, ""));

    if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
    }
}

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

export async function uploadAvatar(
    userId: string,
    file: Express.Multer.File | undefined
) {
    if (!file) {
        throw new AppError(400, "Avatar file is required");
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: safeUserSelect,
    });

    if (!user) {
        throw new AppError(404, "User not found");
    }

    await deleteAvatarFile(user.avatarUrl);

    const avatarUrl = `/uploads/avatars/${file.filename}`;

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { avatarUrl },
        select: safeUserSelect,
    });

    return {
        avatarUrl: updatedUser.avatarUrl,
    };
}

export async function deleteAvatar(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: safeUserSelect,
    });

    if (!user) {
        throw new AppError(404, "User not found");
    }

    if (!user.avatarUrl) {
        throw new AppError(404, "Avatar not found");
    }

    await deleteAvatarFile(user.avatarUrl);

    await prisma.user.update({
        where: { id: userId },
        data: { avatarUrl: null },
    });

    return {
        message: "Аватарку видалено.",
    };
}