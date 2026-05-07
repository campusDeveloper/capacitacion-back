import { Router } from 'express';
import { CustomerTypeController} from '../../controllers/configuration/CustomerTypeController';
import { AuthMiddleware as isAuth } from '../../middlewares/AuthMiddleware';
import { validateSchema, validateQuerySchema } from '../../middlewares/ValidateSchema';
import { CustomerTypeValidator } from '../../validators/configuration/CustomerTypeValidator';
import { CustomerTypeRepository } from '../../repositories/configuration/CustomerTypeRepository';
import { CustomerTypeService } from '../../services/configuration/CustomerTypeService';

const router = Router()

router.get('/configuration/customer-types', isAuth, CustomerTypeController.getAll);
router.get('/select/customers-types', isAuth, CustomerTypeController.getActiveCustomerTypes);
router.post('/configuration/customer-type', isAuth, validateSchema(CustomerTypeValidator.createCustomerTypeSchema),CustomerTypeController.create);
router.put('/configuration/customer-type/:idType/update',isAuth,validateSchema(CustomerTypeValidator.updateCustomerTypeSchema),CustomerTypeController.update);
router.delete('/configuration/customer-type/:idType/delete',isAuth,validateSchema(CustomerTypeValidator.customerTypeIdSchema),CustomerTypeController.delete);
router.put('/configuration/customer-type/:idType/state',isAuth,validateSchema(CustomerTypeValidator.updateCustomerTypeStateSchema),CustomerTypeController.updateState);

export default router;
