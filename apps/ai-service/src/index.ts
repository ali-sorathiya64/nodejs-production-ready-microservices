import express from "express";
import { config } from "dotenv";
import { resolve } from "node:path";
import { AppError, errorHandler, httpLogger, logger, requireGatewaySecret, successResponse } from "shared";

config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), "../../.env") });

const PORT = process.env.AI_PORT || 3005;
const app = express();

app.use(httpLogger);
app.use(express.json());

app.get("/health", (_req, res) => {
    successResponse(res, { service: "AI-Service" });
});

// mount route here

app.use((_req, _res, next) => {
    next(new AppError(404, "Route not found"));
});

app.use(errorHandler);

app.listen(PORT, () => {
    logger.info(`AI Service is running on port ${PORT}`);
});