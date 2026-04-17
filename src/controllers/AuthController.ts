import { Request, Response } from "express"
import jwt from "jsonwebtoken"
import { config } from "../config/config"
import { InvalidCredentialsException } from "../exceptions/InvalidCredentialsException"
import { AuthService } from "../services/AuthService"
import { UserService } from "../services/users/UserService"
import { ApiResponse } from "../utils/apiResponse"
import { LoginUserDto } from "../validators/AuthValidators"

if (!config.jwt) {
  throw new Error("FATAL ERROR: JWT_SECRET no está definido en el entorno.")
}

export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) { }

  login = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email, password } = req.body as LoginUserDto

      const authUser = await this.authService.login(email, password)

      const user = await this.userService.getUserById(authUser.idUser)

      const token = this.generateToken(authUser.idUser, authUser.name)

      this.setAuthCookie(res, token)

      const data = {
        user,
        token
      }

      return ApiResponse.success(res, 'Verificación exitosa', data)

    } catch (error) {
      return this.handleLoginError(res, error)
    }
  }

  logout = async (_req: Request, res: Response): Promise<Response> => {
    res.clearCookie("auth_token")
    return ApiResponse.success(res, "Cierre de sesión exitoso", true)
  }


  private generateToken(id: number, name: string): string {
    return jwt.sign(
      { user: { id, name } },
      config.jwt as string,
      { expiresIn: "1d" }
    )
  }

  private setAuthCookie(res: Response, token: string): void {
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: config.node_env === "production",
      sameSite: config.node_env === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000
    })
  }

  private handleLoginError(res: Response, error: unknown): Response {
    if (error instanceof InvalidCredentialsException) {
      return res.status(400).json({
        errors: {
          root: ["Credenciales inválidas (usuario o contraseña incorrectos)"]
        }
      })
    }

    return res.status(500).json({
      errors: { root: ["Ocurrió un error inesperado al intentar iniciar sesión"] }
    })
  }
}
