import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../db/prisma";
import { AppError } from "../utils/app-error";
import { LoginDto, RegisterDto } from "../schemas/auth.schema";
import {
    RequestPasswordResetDto,
    ResetPasswordDto,
} from "../schemas/password-reset.schema";
import { sendMail } from "../utils/send-mail";

const safeUserSelect = {
    id: true,
    email: true,
    name: true,
    role: true,
    avatarUrl: true,
} as const;

function signToken(user: {
    id: string;
    email: string;
    role: "USER" | "ADMIN";
}) {
    return jwt.sign(
        {
            userId: user.id,
            email: user.email,
            role: user.role,
        },
        process.env.JWT_SECRET as string,
        { expiresIn: "7d" }
    );
}

function signPasswordResetToken(email: string) {
    return jwt.sign(
        {
            email,
            purpose: "password-reset",
        },
        process.env.RESET_PASSWORD_SECRET as string,
        { expiresIn: "10m" }
    );
}

export async function register(data: RegisterDto) {
    const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
    });

    if (existingUser) {
        throw new AppError(400, "Email already in use");
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            passwordHash,
        },
        select: safeUserSelect,
    });

    const token = signToken({
        id: user.id,
        email: user.email,
        role: user.role,
    });

    return { token, user };
}

export async function login(data: LoginDto) {
    const user = await prisma.user.findUnique({
        where: { email: data.email },
    });

    if (!user) {
        throw new AppError(401, "Invalid email or password");
    }

    const passwordMatches = await bcrypt.compare(data.password, user.passwordHash);

    if (!passwordMatches) {
        throw new AppError(401, "Invalid email or password");
    }

    const safeUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl,
    };

    const token = signToken({
        id: safeUser.id,
        email: safeUser.email,
        role: safeUser.role,
    });

    return {
        token,
        user: safeUser,
    };
}

export async function requestPasswordReset(data: RequestPasswordResetDto) {
    const user = await prisma.user.findUnique({
        where: { email: data.email },
        select: safeUserSelect,
    });

    if (user) {
        const token = signPasswordResetToken(user.email);
        const resetLink = `${process.env.APP_URL}/reset-password?token=${encodeURIComponent(token)}`;

        await sendMail({
            to: user.email,
            subject: "Password reset",
            html: `
                <p>You requested a password reset.</p>
                <p>Open this link to set a new password:</p>
                <p><a href="${resetLink}">${resetLink}</a></p>
                <p>This link will expire in 10 minutes.</p>
            `,
        });
    }

    return {
        message: "Якщо вказаний email зареєстрований, лист з інструкціями надіслано.",
    };
}

export async function resetPassword(data: ResetPasswordDto) {
    try {
        const payload = jwt.verify(
            data.token,
            process.env.RESET_PASSWORD_SECRET as string
        ) as {
            email: string;
            purpose: string;
        };

        if (payload.purpose !== "password-reset") {
            throw new AppError(400, "Invalid or expired reset token");
        }

        const user = await prisma.user.findUnique({
            where: { email: payload.email },
        });

        if (!user) {
            throw new AppError(400, "Invalid or expired reset token");
        }

        const passwordHash = await bcrypt.hash(data.password, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: { passwordHash },
        });

        return {
            message: "Пароль успішно змінено.",
        };
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError(400, "Invalid or expired reset token");
    }
}