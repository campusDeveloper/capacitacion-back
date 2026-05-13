import { Router, Request, Response } from "express"
import { AuthMiddleware as isAuth } from "../../middlewares/AuthMiddleware"
import { UsersPermissionRepository } from "../../repositories/users/UsersPermissionsRepository"
import { UsersPermissionsService } from "../../services/users/UsersPermissionService";
import { UsersPermissionsController } from "../../controllers/users/UsersPermissionsController";

const router = Router()
const repository = new UsersPermissionRepository();
const service = new UsersPermissionsService(repository);
const controller = new UsersPermissionsController(service);

router.get("/users/permisos", isAuth, (req: Request, res: Response) => controller.getMatrix(req, res))
router.post("/users/permisos/update", isAuth, (req: Request, res: Response) => controller.update(req, res))
router.post("/users/permisos/update-all", isAuth, (req: Request, res: Response) => controller.updateAll(req, res))

export default router