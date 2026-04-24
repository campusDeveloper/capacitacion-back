import { NextFunction, Request, Response } from "express";
import { OpportunityTrackingServices } from "../../services/configuration/OpportunityTrackingServices";


const service = new OpportunityTrackingServices();
const HEX_COLOR_REGEX = /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

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
            if (color && !HEX_COLOR_REGEX.test(color))
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
            if (color && !HEX_COLOR_REGEX.test(color))
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

    async getDetails(req: Request, res: Response, next: NextFunction) {
        try{
            const idTracking = Number(req.params.idTracking);

            const data = await service.getDetails(idTracking);
            return res.status(200).json({ message: "Consultado Correctamente", data })

        }catch(err){
            next(err)
        }
    }

    async storeSubState(req: Request, res: Response, next: NextFunction) {
        try {
            const idParent = Number(req.params.idTracking);
            const { name, color } = req.body;
            const createdBy = req.user!.id;

            const errors: string[] = [];

            if (!name) errors.push("El campo name es requerido");
            if (!color) errors.push("El campo color es requerido");

            if (errors.length > 0) {
                return res.status(400).json({ message: errors.join(", "), data: false });
            }

            await service.storeSubState(idParent, { name, color, createdBy });

            return res.status(200).json({ message: "Almacenado correctamente", data: true });
        } catch (err) {
            next(err);
        }
    }

    async updateSubState(req: Request, res: Response, next: NextFunction) {
        try {
            const idParent = Number(req.params.idTracking);
            const { idTracking: idChild, name, color } = req.body;

            const errors: string[] = [];

            if (!idChild)          errors.push("El campo idTracking (hijo) es requerido");
            if (!name)             errors.push("El campo name es requerido");
            if (name?.length > 40) errors.push("El campo name no puede superar 40 caracteres");
            if (!color)            errors.push("El campo color es requerido");
            if (color && !HEX_COLOR_REGEX.test(color))
                                   errors.push("El campo color debe ser hexadecimal válido");

            if (errors.length > 0) {
                return res.status(400).json({ message: errors.join(", "), data: false });
            }

            await service.updateSubState(idParent, Number(idChild), { name, color });

            return res.status(200).json({ message: "Actualizado correctamente", data: true });
        } catch (err) {
            next(err);
        }
    }

    async deleteSubState(req: Request, res: Response, next: NextFunction) {
        try {
            const idParent = Number(req.params.idTracking);
            const idChild = Number(req.params.idChild);
        
            await service.deleteSubState(idParent, idChild);
        
            return res.status(200).json({ message: "Eliminado correctamente", data: true });
        } catch (err) {
            next(err);
        }
    }

    async getChildren(req: Request, res: Response, next: NextFunction) {
        try {
            const parentId = Number(req.params.parentId);
            const data = await service.getChildren(parentId);

            return res.status(200).json({ message: "Consultado Correctamente", data });
        } catch (err) {
            next(err);
        }
    }

    async storeChild(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, color, idOpportunityTracking } = req.body;
            const createdBy = req.user!.id;

            const errors: string[] = [];

            if (!name) errors.push("El campo name es requerido");
            if (name?.length > 40) errors.push("El campo name no puede superar 40 caracteres");
            if (!color) errors.push("El campo color es requerido");
            if (color && !HEX_COLOR_REGEX.test(color)) errors.push("El campo color debe ser hexadecimal válido");
            if (!idOpportunityTracking) errors.push("El campo idOpportunityTracking es requerido");

            if (errors.length > 0) {
                return res.status(400).json({ message: errors.join(", "), data: false });
            }

            await service.storeChild({
                name,
                color,
                idOpportunityTracking: Number(idOpportunityTracking),
                createdBy
            });

            return res.status(200).json({ message: "Almacenado correctamente", data: true });
        } catch (err) {
            next(err);
        }
    }

    async updateChild(req: Request, res: Response, next: NextFunction) {
        try {
            const idTracking = Number(req.params.idTracking);
            const { name, color } = req.body;

            const errors: string[] = [];

            if (!name) errors.push("El campo name es requerido");
            if (name?.length > 40) errors.push("El campo name no puede superar 40 caracteres");
            if (!color) errors.push("El campo color es requerido");
            if (color && !HEX_COLOR_REGEX.test(color)) errors.push("El campo color debe ser hexadecimal válido");

            if (errors.length > 0) {
                return res.status(400).json({ message: errors.join(", "), data: false });
            }

            await service.updateChild(idTracking, { name, color });

            return res.status(200).json({ message: "Actualizado correctamente", data: true });
        } catch (err) {
            next(err);
        }
    }

    async deleteChild(req: Request, res: Response, next: NextFunction) {
        try {
            const idTracking = Number(req.params.idTracking);

            await service.deleteChild(idTracking);

            return res.status(200).json({ message: "Eliminado correctamente", data: true });
        } catch (err) {
            next(err);
        }
    }

}
