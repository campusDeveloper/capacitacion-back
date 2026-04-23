import { Router } from 'express';

import { CustomerTypeController } from '../../controllers/configuration/CustomerTypeController';

const router = Router();
const customerTypeController = new CustomerTypeController();


router.get('/configuration/customer-types', (req, res) => customerTypeController.getAll(req, res));
router.post('/configuration/customer-type', (req, res) => customerTypeController.create(req, res));
router.put('/configuration/customer-type/:idType/update', (req, res) => customerTypeController.update(req, res));
router.delete('/configuration/customer-type/:idType/delete', (req, res) => customerTypeController.delete(req, res));
router.put('/configuration/customer-type/:idType/state', (req, res) => customerTypeController.updateState(req, res));
export default router;