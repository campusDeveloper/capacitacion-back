import { Router } from "express";
import { TemplatesController } from "../../controllers/configuration/TemplatesController";
import { AuthMiddleware as isAuth } from "../../middlewares/AuthMiddleware";
import { validateSchema } from "../../middlewares/ValidateSchema";
import { TemplatesValidator } from "../../validators/configuration/TemplatesValidator";

const router = Router();

router.get("/configuration/templates", isAuth, TemplatesController.getTemplates);
router.get("/configuration/template/:idTemplate/detail",isAuth,validateSchema(TemplatesValidator.idTemplateSchema),
  TemplatesController.getTemplateDetail,
);
router.put("/configuration/template/:idTemplate/change-state",isAuth,validateSchema(TemplatesValidator.idTemplateSchema),
  TemplatesController.changeTemplateState,
);
router.delete("/configuration/template/:idTemplate/delete",isAuth,validateSchema(TemplatesValidator.idTemplateSchema),
  TemplatesController.deleteTemplate,
);

export default router;
