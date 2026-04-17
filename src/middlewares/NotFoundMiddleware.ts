import { Request, Response } from "express";
import logger from "../utils/logger";

export const notFoundMiddleware = (req: Request, res: Response): void => {
    logger.warn({
        message: "Route not found",
        method: req.method,
        path: req.originalUrl,
        ip: req.ip
    })

    res.status(404).json({
        error: "Ruta no encontrada",
        message: `La ruta ${req.method} ${req.originalUrl} no existe`,
        timestamp: new Date().toISOString(),
        path: req.originalUrl
    })
}
