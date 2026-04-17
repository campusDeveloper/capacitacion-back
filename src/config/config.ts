import dotenv from "dotenv"
import path from "path"
import { Dialect } from "sequelize"

const nodeEnv = process.env.NODE_ENV || "development"

if (nodeEnv !== "production") {
    const envFiles = [
        `.env.${nodeEnv}`,
        `.env.local`,
        `.env`
    ]

    envFiles.forEach(file => {
        const envPath = path.resolve(process.cwd(), file)
        dotenv.config({ path: envPath })
    })
}

const dialects: Dialect[] = ["mysql"]
const dbDialect = process.env.DB_CONNECTION as Dialect

if (!dbDialect || !dialects.includes(dbDialect)) {
    throw new Error(`DB_CONNECTION debe ser uno de: ${dialects.join(", ")}`)
}

const requiredEnvVars = [
    "JWT_SECRET",
    "DB_HOST",
    "DB_USERNAME",
    "DB_DATABASE"
]

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName])

if (missingEnvVars.length > 0) {
    throw new Error(`Variables de entorno requeridas faltantes: ${missingEnvVars.join(", ")}`)
}

const parsePort = (port: string | undefined, defaultPort: number): number => {
    if (!port) return defaultPort
    const parsed = parseInt(port, 10)
    if (isNaN(parsed) || parsed < 0 || parsed > 65535) {
        throw new Error(`Puerto inválido: ${port}`)
    }
    return parsed
}

const dbPort = parsePort(process.env.DB_PORT, 3306)
const appPort = parsePort(process.env.PORT, 3000)



export const config = {
    jwt: process.env.JWT_SECRET!,
    port: appPort,
    admin_url: process.env.ADMIN_URL,
    node_env: nodeEnv,
    database: {
        dialect: dbDialect,
        host: process.env.DB_HOST!,
        port: dbPort,
        username: process.env.DB_USERNAME!,
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_DATABASE!,
        logging: process.env.DB_LOGGING === "true"
    },
    redis: {
        host: process.env.REDIS_HOST || "localhost",
        port: parseInt(process.env.REDIS_PORT || "6379"),
        password: process.env.REDIS_PASSWORD,
        db: parseInt(process.env.REDIS_DB || "0"),
    },
    aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_DEFAULT_REGION || "us-east-1",
        bucket: process.env.AWS_BUCKET
    },
   
} as const

export const isAwsConfigured = (): boolean => {
    return !!(
        config.aws.accessKeyId &&
        config.aws.secretAccessKey &&
        config.aws.bucket
    )
}
