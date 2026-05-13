import { Router } from 'express';
import { PreReservationController } from '../../controllers/reservations/PreReservationController';

const router = Router();

router.get('/pre-reservations/actives', PreReservationController.getActives);
router.get('/pre-reservations/expired', PreReservationController.getExpired);

export default router;