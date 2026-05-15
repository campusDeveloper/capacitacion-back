import { Router } from "express";
import { OpportunityController } from "../../controllers/opportunities/OpportunityController";
import { AuthMiddleware as isAuth } from "../../middlewares/AuthMiddleware";
import { validateQuerySchema } from "../../middlewares/ValidateSchema";
import { OpportunityValidator } from "../../validators/opportunities/OpportunityValidator";

const router = Router();


router.get(
  "/opportunities/list",
  isAuth,
  validateQuerySchema(OpportunityValidator.getListQuerySchema),
  OpportunityController.getList
);
router.get(
  "/opportunity/:idOpportunity/comments",
  isAuth,
  OpportunityController.getComments
);
router.post(
  "/opportunity/:idOpportunity/comment",
  isAuth,
  OpportunityController.createComment
);
router.put(
  "/opportunity/:idOpportunity/change-state",
  isAuth,
  OpportunityController.changeInterestState
);
router.put(
  "/opportunity/:idOpportunity/change-user",
  isAuth,
  OpportunityController.changeAssignedUser
);

export default router;
