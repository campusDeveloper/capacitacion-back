import { NextFunction, Request, Response } from "express";
import { OpportunityTrackingServices } from "../../services/configuration/OpportunityTrackingServices";


const service = new OpportunityTrackingServices();

export class OpportunityTrackingController {
    async getList(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await service.getList();
            res.status(200).json({ message: "OK", data });
        } catch (err) { 
            next(err);  
        }
    }

    async store(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, color, sub = [] } = req.body;
            const createdBy = req.user!.id;

            const errors: string[] = [];

            if (!name)             errors.push("El campo name es requerido");
            if (name?.length > 40) errors.push("El campo name no puede superar 40 caracteres");
            if (!color)            errors.push("El campo color es requerido");
            if (color && !/^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(color))
                                   errors.push("El campo color debe ser hexadecimal válido");

            sub.forEach((item: any, index: number) => {
                if (!item.name)  errors.push(`sub[${index}]: name es requerido`);
                if (!item.color) errors.push(`sub[${index}]: color es requerido`);
            });

            if (errors.length > 0) {
                return res.status(400).json({ message: errors.join(", "), data: false });
            }

            await service.store({ name, color, sub, createdBy });

            return res.status(200).json({ message: "Almacenado correctamente", data: true });
        } catch (err) {
            next(err);
        }
    }   
    
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const idTracking = Number(req.params.idTracking);
            const { name, color } = req.body;

            const errors: string[] = [];

            if (!name)             errors.push("El campo name es requerido");
            if (name?.length > 40) errors.push("El campo name no puede superar 40 caracteres");
            if (!color)            errors.push("El campo color es requerido");
            if (color && !/^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(color))
                                   errors.push("El campo color debe ser hexadecimal válido");

            if (errors.length > 0) {
                return res.status(400).json({ message: errors.join(", "), data: false });
            }

            await service.update(idTracking, { name, color });

            return res.status(200).json({ message: "Actualizado correctamente", data: true });
        } catch (err) {
            next(err);
        }
    }

    async updateState(req: Request, res: Response, next: NextFunction) {
        try{
            const idTracking = Number(req.params.idTracking);

            await service.updateState(idTracking);

            return res.status(200).json({"message": "Actualizado correctamente", data:true })
        } catch(err) {
            next(err);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const idTracking = Number(req.params.idTracking);
        
            await service.delete(idTracking);
        
            return res.status(200).json({ message: "Eliminado correctamente", data: true });
        } catch (err) {
            next(err);
        }
    }

}