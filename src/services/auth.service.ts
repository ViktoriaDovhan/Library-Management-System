import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../db/prisma";
import { AppError } from "../utils/app-error";
import { LoginDto, RegisterDto } from "../schemas/auth.schema";

const safeUserSelect = {
    id: true,
    email: true,
    name: true,
    role: true,
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