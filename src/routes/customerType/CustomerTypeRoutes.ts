import { Router } from 'express';

import { CustomerTypeController } from '../../controllers/customerType/CustomerTypeController';

const router = Router();
const customerTypeController = new CustomerTypeController();


router.get('/customer-types', (req, res) => customerTypeController.getAll(req, res));

export default router;