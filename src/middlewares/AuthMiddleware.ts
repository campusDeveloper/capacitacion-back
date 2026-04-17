import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import { config } from "../config/config"
import { tokenManager } from "./TokenManager"

interface JWTPayload extends JwtPayload {
    user: {
        id: number
        name: string
        idRol: number
    }
}

export const AuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = extractToken(req)

        if (!token) {
            return res.status(401).json({ error: "Acceso denegado. Token no proporcionado" })
        }

        if (tokenManager.isTokenInvalid(token)) {
            return res.status(401).json({ error: "Sesión invalidada o expirada" })
        }

        if (!config.jwt) {
            console.error("JWT_SECRET missing in config")
            return res.status(500).json({ error: "Error interno del servidor" })
        }

        const decoded = jwt.verify(token, config.jwt) as JWTPayload

        req.user = decoded.user

        next()
    } catch (error) {
        handleJwtError(res, error)
    }
}

const extractToken = (req: Request): string | null => {
    if (req.cookies?.auth_token) {
        return req.cookies.auth_token
    }

    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith("Bearer ")) {
        return authHeader.split(" ")[1]
    }

    return null
}


const handleJwtError = (res: Response, error: unknown) => {
    if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ error: "Su sesión ha expirado, por favor inicie sesión nuevamente" })
    }

    if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ error: "Token inválido" })
    }

    console.error("Auth Middleware Error:", error)
    return res.status(500).json({ error: "Error interno en la autenticación" })
}
