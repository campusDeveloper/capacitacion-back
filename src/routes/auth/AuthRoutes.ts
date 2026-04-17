import { Router } from "express"
import { AuthController } from "../../controllers/AuthController"
import { validateSchema } from "../../middlewares/ValidateSchema"
import { AuthRepository } from "../../repositories/AuthRepository"
import { UserRepository } from "../../repositories/users/UserRepository"
import { AuthService } from "../../services/AuthService"
import { UserService } from "../../services/users/UserService"
import { loginUserDto } from "../../validators/AuthValidators"

const router = Router()

const authRepo = new AuthRepository()
const userRepo = new UserRepository()
const authService = new AuthService(authRepo)
const userService = new UserService(userRepo)

const authController = new AuthController(authService, userService)

router.post("/login", validateSchema(loginUserDto), authController.login)
router.post("/logout", authController.logout)

export default router
