import { Router } from "express"
import { OpportunityStateController } from "../../controllers/configuration/OpportunityStateController"
import { AuthMiddleware as isAuth } from "../../middlewares/AuthMiddleware"
import { validateSchema } from '../../middlewares/ValidateSchema';
import { OpportunityStateValidator } from "../../validators/configuration/OpportunityStateValidator";

const router = Router()

router.get("/state-oportunity", isAuth, OpportunityStateController.getAllOpportunityStates);
router.get("/state-oportunity/:id", isAuth, validateSchema(OpportunityStateValidator.OpportunityStateIdSchema), OpportunityStateController.getOpportunityStateById);
router.post("/state-oportunity", isAuth, validateSchema(OpportunityStateValidator.OpportunityStateSchema), OpportunityStateController.createOpportunityState);
router.put('/state-oportunity/:id', isAuth, validateSchema(OpportunityStateValidator.OpportunityStateUpdateSchema), OpportunityStateController.updateOpportunityState);
router.delete('/state-oportunity/:id', isAuth, validateSchema(OpportunityStateValidator.OpportunityStateIdSchema), OpportunityStateController.deleteOpportunityState);
router.put('/state-oportunity/:id/switch-status', isAuth, validateSchema(OpportunityStateValidator.OpportunityStateIdSchema), OpportunityStateController.switchStatus);

export default router
