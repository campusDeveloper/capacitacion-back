import { NextFunction, Request, Response } from "express";
import { config } from "../config/config";
import logger from "../utils/logger";

interface ErrorResponse {
    error: string;
    message: string;
    location?: string;
    stack?: string;
    timestamp: string;
    path: string;
    method: string;
}

export const ErrorMiddleware = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        const status = err.status || err.statusCode || 500
        const errorLocation = extractErrorLocation(err)

        logError(err, req, errorLocation, status)

        const response = buildErrorResponse(err, req, errorLocation, status)

        if (res.headersSent) {
            return next(err)
        }

        res.status(status).json(response)
    } catch (middlewareError) {
        logger.error({
            message: "Error en ErrorMiddleware",
            originalError: err.message,
            middlewareError: middlewareError instanceof Error ? middlewareError.message : String(middlewareError),
            path: req.originalUrl
        })

        if (!res.headersSent) {
            res.status(500).json({
                error: "Internal Server Error",
                message: "Ha ocurrido un error inesperado",
                timestamp: new Date().toISOString()
            })
        }
    }
}

const extractErrorLocation = (err: any): string => {
    if (!err.stack) return "Unknown location"

    try {
        const stackLines = err.stack.split("\n")
        const relevantLine = stackLines.find((line: string) =>
            (line.includes(".ts") || line.includes(".js")) &&
            !line.includes("node_modules")
        )

        if (relevantLine) {
            const match = relevantLine.match(/\((.+?):(\d+):(\d+)\)/) ||
                relevantLine.match(/at (.+?):(\d+):(\d+)/)

            if (match) {
                const [, file, line, column] = match
                const fileName = file.split("/").pop() || file
                return `${fileName}:${line}:${column}`
            }
        }

        return relevantLine?.trim() || "Unknown location"
    } catch {
        return "Unknown location"
    }
}

const logError = (
    err: any,
    req: Request,
    location: string,
    status: number
): void => {
    const errorLevel = status >= 500 ? "error" : "warn"

    logger[errorLevel]({
        message: err.message || "Error sin mensaje",
        name: err.name || "Error",
        status,
        method: req.method,
        path: req.originalUrl,
        location,
        stack: err.stack,
        body: sanitizeBody(req.body),
        query: req.query,
        params: req.params,
        ip: req.ip || req.socket.remoteAddress,
        userAgent: req.get("user-agent"),
        timestamp: new Date().toISOString()
    })
}

const sanitizeBody = (body: any): any => {
    if (!body || typeof body !== "object") return body

    const sensitiveFields = ["password", "token", "secret", "apiKey", "creditCard"]
    const sanitized = { ...body }

    for (const field of sensitiveFields) {
        if (field in sanitized) {
            sanitized[field] = "***REDACTED***"
        }
    }

    return sanitized
}

const buildErrorResponse = (
    err: any,
    req: Request,
    location: string,
    status: number
): ErrorResponse => {
    const isDevelopment = config.node_env === "development"

    return {
        error: getErrorName(err, status),
        message: getErrorMessage(err, status),
        ...(isDevelopment && { location }),
        ...(isDevelopment && err.stack && { stack: err.stack }),
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
        method: req.method
    }
}

const getErrorName = (err: any, status: number): string => {
    if (status >= 500) {
        return config.node_env === "development" ? err.name || "InternalServerError" : "Internal Server Error"
    }
    return err.name || "Error"
}

const getErrorMessage = (err: any, status: number): string => {
    if (status >= 500 && config.node_env !== "development") {
        return "Ha ocurrido un error en el servidor. Por favor, intente nuevamente más tarde."
    }
    return err.message || "Ha ocurrido un error"
}

export const setupGlobalErrorHandlers = (): void => {
    process.on("unhandledRejection", (reason: any, promise: Promise<any>) => {
        logger.error({
            message: "Unhandled Promise Rejection",
            reason: reason?.message || reason,
            stack: reason?.stack,
            promise: promise.toString()
        })
    })

    process.on("uncaughtException", (error: Error) => {
        logger.error({
            message: "Uncaught Exception",
            error: error.message,
            stack: error.stack
        })
    })
}
