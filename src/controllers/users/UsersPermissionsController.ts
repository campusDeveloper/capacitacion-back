import { Request, Response } from 'express';
import { UsersPermissionsService } from '../../services/users/UsersPermissionService';

export class UsersPermissionsController {
    constructor(private service: UsersPermissionsService) {}

    async getMatrix(req: Request, res: Response) {
        const data = await this.service.getMatrix();
        res.status(200).json({ data });
    }

    async update(req: Request, res: Response) {
        const { module, idUser, value } = req.body;
        const adminId = (req as any).user.id;
        await this.service.togglePermission(module, idUser, value, adminId);
        res.status(200).json({ message: "Actualizado correctamente" });
    }

    async updateAll(req: Request, res: Response) {
        const adminId = (req as any).user.id;
        await this.service.updateBulk(req.body, adminId);
        res.status(200).json({ message: "Proceso masivo actualizado correctamente" });
    }
}