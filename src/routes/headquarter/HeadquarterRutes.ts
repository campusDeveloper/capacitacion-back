import { Router } from 'express';
import { HeadquarterController } from '../../controllers/config/HeadquarterController';
import { validateSchema as ValidateSchema } from '../../middlewares/ValidateSchema'; 
import { HeadquarterIdParamSchema } from '../../validators/headquearter/HeadquarterValidator';
import { AuthMiddleware } from '../../middlewares/AuthMiddleware';

const router = Router();

// Tarea A: GET domain.com/api/configuration/conocimiento/headquarters
router.get(
  '/configuration/conocimiento/headquarters',
  AuthMiddleware,
  HeadquarterController.getHeadquartersWithKnowledge
);

// Tarea B: PUT domain.com/api/configuration/conocimiento/headquarter/{idHeadquarter}/change-state
router.put(
  '/configuration/conocimiento/headquarter/:id/change-state',
  AuthMiddleware,
  ValidateSchema(HeadquarterIdParamSchema),
  HeadquarterController.switchState
);

export default router;