import crypto from "crypto";
import fs from "fs";
import path from "path";
import multer from "multer";

const avatarsDir = path.join(process.cwd(), "uploads", "avatars");

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        fs.mkdirSync(avatarsDir, { recursive: true });
        cb(null, avatarsDir);
    },
    filename: (_req, file, cb) => {
        const extension = path.extname(file.originalname).toLowerCase();
        const rawName = path.basename(file.originalname, extension);
        const safeName = rawName.replace(/[^a-zA-Z0-9_-]/g, "-") || "avatar";

        cb(null, `${crypto.randomUUID()}-${safeName}${extension}`);
    },
});

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png"];

    if (!allowedMimeTypes.includes(file.mimetype)) {
        cb(new Error("Only JPEG and PNG images are allowed"));
        return;
    }

    cb(null, true);
};

export const uploadAvatar = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});