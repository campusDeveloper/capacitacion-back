import fs from "fs"
import path from "path"
import winston from "winston"

const LOG_DIR = path.join(process.cwd(), "logs")
const ENV = process.env.NODE_ENV || "development"
const IS_PROD = ENV === "production"
const IS_TEST = ENV === "test"

const LOG_CONFIG = {
	maxSize: 5 * 1024 * 1024,
	maxFiles: 5,
}

const levels = {
	error: 0,
	warn: 1,
	info: 2,
	http: 3,
	debug: 4,
}

const colors = {
	error: "red",
	warn: "yellow",
	info: "green",
	http: "magenta",
	debug: "blue",
}

winston.addColors(colors)

const devFormat = winston.format.combine(
	winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
	winston.format.colorize({ all: true }),
	winston.format.printf(
		({ timestamp, level, message, stack }) =>
			`${timestamp} [${level}]: ${message}${stack ? `\n${stack}` : ""}`
	)
)

const prodFormat = winston.format.combine(
	winston.format.timestamp(),
	winston.format.errors({ stack: true }),
	winston.format.json()
)

const transports: winston.transport[] = [
	new winston.transports.Console({
		format: IS_PROD ? prodFormat : devFormat,
	}),
]

if (IS_PROD) {
	if (!fs.existsSync(LOG_DIR)) {
		try {
			fs.mkdirSync(LOG_DIR, { recursive: true })
		} catch (error) {
			console.error("Could not create log directory. Logging to console only.", error)
		}
	}

	if (fs.existsSync(LOG_DIR)) {
		transports.push(
			new winston.transports.File({
				filename: path.join(LOG_DIR, "errors.log"),
				level: "error",
				maxsize: LOG_CONFIG.maxSize,
				maxFiles: LOG_CONFIG.maxFiles,
				format: prodFormat,
			}),
			new winston.transports.File({
				filename: path.join(LOG_DIR, "combined.log"),
				maxsize: LOG_CONFIG.maxSize,
				maxFiles: LOG_CONFIG.maxFiles,
				format: prodFormat,
			})
		)
	}
}

const logger = winston.createLogger({
	level: IS_PROD ? "info" : "debug",
	levels,
	transports,
	exitOnError: false,
	silent: IS_TEST,
})

export const morganStream = {
	write: (message: string) => {
		logger.http(message.trim())
	}
}

export default logger
