import path from "path"
import { Sequelize } from "sequelize-typescript"
import logger from "../utils/logger"
import { config } from "./config"

const isProduction = ["production"].includes(config.node_env)

export const sequelize = new Sequelize({
    dialect: config.database.dialect,
    host: config.database.host,
    port: config.database.port,
    username: config.database.username,
    password: config.database.password,
    database: config.database.database,
    models: [path.join(__dirname, `/../models/*.${isProduction ? "js" : "ts"}`)],
    logging: config.database.logging ? (msg) => logger.debug(msg) : false,
    pool: {
        max: 10,
        min: 2,
        acquire: 30000,
        idle: 10000,
        evict: 10000
    },
    dialectOptions: {
        connectTimeout: 60000
    },
    define: {
        timestamps: true,
        underscored: false,
        freezeTableName: true
    }
})

export const connectDB = async (): Promise<void> => {
    try {
        await sequelize.authenticate()

        logger.info({
            message: "✅ Database connection established successfully",
            dialect: config.database.dialect,
            host: config.database.host,
            database: config.database.database,
            environment: config.node_env
        })

    } catch (error) {
        logger.error({
            message: "❌ Unable to connect to the database",
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            config: {
                dialect: config.database.dialect,
                host: config.database.host,
                database: config.database.database
            }
        })

        throw error
    }
}

export const disconnectDB = async (): Promise<void> => {
    try {
        await sequelize.close()
        logger.info("🔴 Database connection closed")
    } catch (error) {
        logger.error({
            message: "Error closing database connection",
            error: error instanceof Error ? error.message : String(error)
        })
        throw error
    }
}

export const checkDBConnection = async (): Promise<boolean> => {
    try {
        await sequelize.authenticate()
        return true
    } catch (error) {
        logger.error({
            message: "Database health check failed",
            error: error instanceof Error ? error.message : String(error)
        })
        return false
    }
}
