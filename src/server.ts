import cookieParser from "cookie-parser"
import cors from "cors"
import express from "express"
import fileUpload from "express-fileupload"
import helmet from "helmet"
import morgan from "morgan"
import { config } from "./config/config"
import { connectDB } from "./config/database"
import { ErrorMiddleware, setupGlobalErrorHandlers } from "./middlewares/ErrorMiddleware"
import { notFoundMiddleware } from "./middlewares/NotFoundMiddleware"
import routes from "./routes"
import logger from "./utils/logger"

const app = express()
const PORT = config.port || 3000

// 🔒 Seguridad
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}))

const allowedOrigins = [
    config.admin_url
]

// 🔐 CORS
app.use(cors({
    origin: function (origin, callback) {
        // Permitir solicitudes sin origin (como Postman o curl)
        if (!origin) return callback(null, true)

        if (allowedOrigins.includes(origin)) {
            callback(null, true) // origen permitido
        } else {
            callback(new Error("CORS: origen no permitido → " + origin))
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))

// 🧠 Parsing de peticiones
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb" }))
app.use(cookieParser())

// 📁 File upload con configuración segura
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    abortOnLimit: true,
    createParentPath: true,
    useTempFiles: true,
    tempFileDir: "/tmp/",
    safeFileNames: true,
    preserveExtension: true
}))

// 🧾 Logs de peticiones
if (config.node_env === "development") {
    app.use(morgan("dev"))
} else {
    app.use(morgan("combined", {
        stream: {
            write: (message: string) => logger.info(message.trim())
        }
    }))
}

// 📦 Rutas principales
app.use("/api", routes)

// ❌ Ruta no encontrada
app.use(notFoundMiddleware)

// 💥 Manejo de errores global
app.use(ErrorMiddleware)

// 🌍 Manejadores de errores globales
setupGlobalErrorHandlers()

// 🚀 Inicio de la aplicación
const startServer = async (): Promise<void> => {
    try {
        await connectDB()
        logger.info("✅ Database connected successfully")

        const server = app.listen(PORT, "0.0.0.0", () => {
            logger.info(`✅ Server running on port ${PORT}`)
            logger.info(`🌍 Environment: ${config.node_env}`)
            logger.info(`🔗 URL: http://localhost:${PORT}`)
        })

        const gracefulShutdown = async (signal: string): Promise<void> => {
            logger.info(`${signal} received. Starting graceful shutdown...`)

            server.close(async () => {
                logger.info("🔴 HTTP server closed")

                try {
                    logger.info("🔴 Database connection closed")
                    process.exit(0)
                } catch (error) {
                    logger.error("Error during shutdown:", error)
                    process.exit(1)
                }
            })

            setTimeout(() => {
                logger.error("⚠️ Forced shutdown after timeout")
                process.exit(1)
            }, 10000)
        }

        process.on("SIGTERM", () => gracefulShutdown("SIGTERM"))
        process.on("SIGINT", () => gracefulShutdown("SIGINT"))

    } catch (error) {
        logger.error("❌ Error starting server:", error)
        process.exit(1)
    }
}

process.on("uncaughtException", (error: Error) => {
    logger.error("💥 Uncaught Exception:", {
        message: error.message,
        stack: error.stack
    })
})

process.on("unhandledRejection", (reason: any) => {
    logger.error("💥 Unhandled Rejection:", {
        reason: reason?.message || reason,
        stack: reason?.stack
    })
})

startServer()

export default app
