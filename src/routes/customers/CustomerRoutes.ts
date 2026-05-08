import { Router } from 'express';
import { CustomerController } from '../../controllers/customers/CustomerController';
import { AuthMiddleware as isAuth } from '../../middlewares/AuthMiddleware';
import { validateQuerySchema, validateSchema } from '../../middlewares/ValidateSchema';
import { CustomerValidator } from '../../validators/customers/CustomerValidator';

const router = Router();

router.get(
    '/customers/list',
    isAuth,
    validateQuerySchema(CustomerValidator.getCustomersListQuerySchema),
    CustomerController.getCustomersList
);

router.put(
    '/customer/:idCustomer/change-type',
    isAuth,
    validateSchema(CustomerValidator.changeCustomerTypeSchema),
    CustomerController.changeCustomerType
);

router.get(
    '/customer/:idCustomer/reservations',
    isAuth,
    validateSchema(CustomerValidator.getCustomerReservationsParamsSchema),
    CustomerController.getCustomerReservations
);

export default router;