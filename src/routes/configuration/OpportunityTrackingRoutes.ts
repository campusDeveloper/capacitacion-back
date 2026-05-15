import { Router } from "express";
import { OpportunityTrackingController } from "../../controllers/configuration/OpportunityTrackingController";
import { AuthMiddleware as isAuth } from "../../middlewares/AuthMiddleware";
import { validateSchema } from "../../middlewares/ValidateSchema";
import { OpportunityTrackingValidators } from "../../validators/configuration/OpportunityTrackingValidators";

const router = Router();
const controller = new OpportunityTrackingController();

// get 1
router.get("/configuration/tracking-opportunities", isAuth, (req, res, next) =>
    controller.getList(req, res, next)    
)

router.get(
    "/configuration/tracking-opportunities/:parentId/children", isAuth, validateSchema(OpportunityTrackingValidators.ChildrenByParentSchema), (req, res, next) =>
        controller.getChildren(req, res, next)
);

router.post(
    "/configuration/tracking-opportunities/children", isAuth, validateSchema(OpportunityTrackingValidators.StoreChildSchema), (req, res, next) =>
        controller.storeChild(req, res, next)
);

router.put(
    "/configuration/tracking-opportunities/children/:idTracking", isAuth, validateSchema(OpportunityTrackingValidators.UpdateChildSchema), (req, res, next) =>
        controller.updateChild(req, res, next)
);

router.delete(
    "/configuration/tracking-opportunities/children/:idTracking", isAuth, validateSchema(OpportunityTrackingValidators.ChildIdSchema), (req, res, next) =>
        controller.deleteChild(req, res, next)
);

router.post(
    "/configuration/tracking-opportunity/store", isAuth, validateSchema(OpportunityTrackingValidators.StoreParentSchema), (req, res, next) => 
        controller.store(req, res, next)
);

router.put(
    "/configuration/tracking-opportunity/:idTracking/update", isAuth, validateSchema(OpportunityTrackingValidators.UpdateParentSchema), (req,res,next) => 
        controller.update(req, res, next)
);

router.put(
    "/configuration/tracking-opportunity/:idTracking/update-state", isAuth, validateSchema(OpportunityTrackingValidators.ParentIdSchema), (req, res, next) => 
        controller.updateState(req, res, next)
);


router.delete( "/configuration/tracking-opportunity/:idTracking/delete", isAuth, validateSchema(OpportunityTrackingValidators.ParentIdSchema), (req, res, next) => 
        controller.delete(req, res, next)
);

router.get(
    "/configuration/tracking-opportunity/:idTracking/detail", isAuth, validateSchema(OpportunityTrackingValidators.ParentIdSchema), (req, res, next) => 
        controller.getDetails(req, res, next)
);

router.post(
    "/configuration/tracking-opportunity/:idTracking/sub-state", isAuth, validateSchema(OpportunityTrackingValidators.StoreSubStateSchema), (req, res, next) =>
        controller.storeSubState(req, res, next)
);

router.put(
    "/configuration/tracking-opportunity/:idTracking/sub-state",isAuth, validateSchema(OpportunityTrackingValidators.UpdateSubStateSchema), (req, res, next) => 
        controller.updateSubState(req, res, next)
);

router.delete(
    "/configuration/tracking-opportunity/:idTracking/sub-state/:idChild/delete",isAuth, validateSchema(OpportunityTrackingValidators.DeleteSubStateSchema), (req, res, next) => 
        controller.deleteSubState(req, res, next)    
);

router.get(
    "/select/seguimiento", isAuth, (req, res, next) =>
        controller.getSelectParentTrackings(req, res, next)
);

export default router;
