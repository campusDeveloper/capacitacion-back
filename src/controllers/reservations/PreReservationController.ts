import { Request, Response } from 'express';
import { PreReservationService } from '../../services/reservations/PreReservationService';

export class PreReservationController {
    static async getActives(req: Request, res: Response) {
        try {
            const service = new PreReservationService();
            const data = await service.getActives();
            return res.status(200).json({ message: "consultado correctamente", data });
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    static async getExpired(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const service = new PreReservationService();
            const data = await service.getExpired(page, limit);
            return res.status(200).json({ message: "consultado correctamente", data });
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }
}