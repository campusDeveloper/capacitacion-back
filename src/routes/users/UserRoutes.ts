import { Router } from "express"
import { UserController } from "../../controllers/users/UserController"
import { AuthMiddleware as isAuth } from "../../middlewares/AuthMiddleware"
import { UserRepository } from "../../repositories/users/UserRepository"
import { UserService } from "../../services/users/UserService";
import { validateSchema, validateQuerySchema } from '../../middlewares/ValidateSchema';
import { UserValidator } from "../../validators/users/UserValidator";
import { checkModuleAccess } from "../../middlewares/CheckModuleMiddleware";

const router = Router()

const userRepository = new UserRepository()
const userService = new UserService(userRepository)
const userController = new UserController(userService)

router.get("/user", isAuth, userController.getUser);
router.get("/users", isAuth, validateQuerySchema(UserValidator.getUserQuerySchema), UserController.getAllUsers);
router.get("/users/:idUser/headquartes", isAuth, UserController.getSubHeadquartersByUser);
router.post("/user", isAuth, validateSchema(UserValidator.UserSchema), UserController.createUser);
router.put('/user/:idUser/edit', isAuth, validateSchema(UserValidator.UserUpdateSchema), UserController.updateUser);
router.put('/user/:idUser/main-headquarter', isAuth, validateSchema(UserValidator.UserHeadUpdateSchema), UserController.updateUsersHeadquarter);
router.put('/user/:idUser/headquarters', isAuth, validateSchema(UserValidator.UserSubHeadUpdateSchema), UserController.updateUsersSubHeadquarter);
router.delete('/user/:idUser/delete', isAuth, validateSchema(UserValidator.UserIdSchema), UserController.deleteUser);
router.put('/user/:idUser/switch-status', isAuth, validateSchema(UserValidator.UserIdSchema), UserController.switchStatus);

export default router
