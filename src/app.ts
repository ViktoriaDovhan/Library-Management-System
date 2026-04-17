import express from "express";
import path from "path";
import routes from "./routes";
import { notFound } from "./middleware/not-found.middleware";
import { errorHandler } from "./middleware/error.middleware";

export const app = express();

app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);