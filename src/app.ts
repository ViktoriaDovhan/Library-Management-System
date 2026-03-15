import express from "express";
import routes from "./routes";
import { notFound } from "./middleware/not-found.middleware";
import { errorHandler } from "./middleware/error.middleware";

export const app = express();

app.use(express.json());
app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);