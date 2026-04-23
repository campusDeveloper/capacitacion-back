import { Router } from "express";
import { OpportunityTrackingController } from "../../controllers/configuration/OpportunityTrackingController";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";

const router = Router();
const controller = new OpportunityTrackingController();

// get 1
router.get("/configuration/tracking-opportunities", AuthMiddleware, (req, res, next) =>
    controller.getList(req, res, next)    
)

router.post(
    "/configuration/tracking-opportunity/store", AuthMiddleware, (req, res, next) => 
        controller.store(req, res, next)
);

router.put(
    "/configuration/tracking-opportunity/:idTracking/update", AuthMiddleware, (req,res,next) => 
        controller.update(req, res, next)
);

router.put(
    "/configuration/tracking-opportunity/:idTracking/update-state", AuthMiddleware, (req, res, next) => 
        controller.updateState(req, res, next)
);


router.delete( "/configuration/tracking-opportunity/:idTracking/delete", AuthMiddleware,(req, res, next) => 
        controller.delete(req, res, next)
);


export default router;