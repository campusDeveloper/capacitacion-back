import { Router } from 'express';
import { CustomerController } from '../../controllers/customers/CustomerController';
import { AuthMiddleware as isAuth } from '../../middlewares/AuthMiddleware';
import { validateQuerySchema } from '../../middlewares/ValidateSchema';
import { CustomerValidator } from '../../validators/customers/CustomerValidator';

const router = Router();

router.get(
    '/customers/list',
    isAuth,
    validateQuerySchema(CustomerValidator.getCustomersListQuerySchema),
    CustomerController.getCustomersList
);

export default router;