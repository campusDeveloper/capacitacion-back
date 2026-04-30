import { Router } from "express"
import { HeadquarterController } from "../../controllers/headquarters/HeadquarterController"
import { AuthMiddleware as isAuth } from "../../middlewares/AuthMiddleware"
import { validateSchema } from '../../middlewares/ValidateSchema';
import { HeadquarterValidator } from "../../validators/headquarters/HeadquarterValidator";

const router = Router()

router.get("/select/headquarters", isAuth, HeadquarterController.getSelectHeadquarters);
router.get(
    "/user/:idUser/headquarters",
    isAuth,
    validateSchema(HeadquarterValidator.UserHeadquartersParamsSchema),
    HeadquarterController.getUserHeadquarters,
);
router.put(
    "/user/:idUser/main-headquarter",
    isAuth,
    validateSchema(HeadquarterValidator.UpdateMainHeadquarterSchema),
    HeadquarterController.updateMainHeadquarter,
);
router.put(
    "/user/:idUser/headquarters",
    isAuth,
    validateSchema(HeadquarterValidator.UpdateUserHeadquarterSchema),
    HeadquarterController.updateUserHeadquarter,
);

export default router
