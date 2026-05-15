import { NextFunction, Request, Response } from "express";
import { OpportunityTrackingServices } from "../../services/configuration/OpportunityTrackingServices";
import { ApiResponse } from "../../utils/apiResponse";

const service = new OpportunityTrackingServices();

export class OpportunityTrackingController {
    async getList(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await service.getList();
            return ApiResponse.success(res, "OK", data);
        } catch (err) { 
            next(err);  
        }
    }

    async store(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, color, sub = [] } = req.body;
            const createdBy = req.user!.id;

            await service.store({ name, color, sub, createdBy });

            return ApiResponse.success(res, "Almacenado correctamente", true);
        } catch (err) {
            next(err);
        }
    }   
    
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const idTracking = Number(req.params.idTracking);
            const { name, color } = req.body;

            await service.update(idTracking, { name, color });

            return ApiResponse.success(res, "Actualizado correctamente", true);
        } catch (err) {
            next(err);
        }
    }

    async updateState(req: Request, res: Response, next: NextFunction) {
        try{
            const idTracking = Number(req.params.idTracking);

            await service.updateState(idTracking);

            return ApiResponse.success(res, "Actualizado correctamente", true);
        } catch(err) {
            next(err);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const idTracking = Number(req.params.idTracking);

            await service.delete(idTracking);

            return ApiResponse.success(res, "Eliminado correctamente", true);
        } catch (err) {
            next(err);
        }
    }

    async getDetails(req: Request, res: Response, next: NextFunction) {
        try{
            const idTracking = Number(req.params.idTracking);

            const data = await service.getDetails(idTracking);
            return ApiResponse.success(res, "Consultado Correctamente", data);

        }catch(err){
            next(err)
        }
    }

    async storeSubState(req: Request, res: Response, next: NextFunction) {
        try {
            const idParent = Number(req.params.idTracking);
            const { name, color } = req.body;
            const createdBy = req.user!.id;

            await service.storeSubState(idParent, { name, color, createdBy });

            return ApiResponse.success(res, "Almacenado correctamente", true);
        } catch (err) {
            next(err);
        }
    }

    async updateSubState(req: Request, res: Response, next: NextFunction) {
        try {
            const idParent = Number(req.params.idTracking);
            const { idTracking: idChild, name, color } = req.body;

            await service.updateSubState(idParent, Number(idChild), { name, color });

            return ApiResponse.success(res, "Actualizado correctamente", true);
        } catch (err) {
            next(err);
        }
    }

    async deleteSubState(req: Request, res: Response, next: NextFunction) {
        try {
            const idParent = Number(req.params.idTracking);
            const idChild = Number(req.params.idChild);
        
            await service.deleteSubState(idParent, idChild);
        
            return ApiResponse.success(res, "Eliminado correctamente", true);
        } catch (err) {
            next(err);
        }
    }

    async getChildren(req: Request, res: Response, next: NextFunction) {
        try {
            const parentId = Number(req.params.parentId);
            const data = await service.getChildren(parentId);

            return ApiResponse.success(res, "Consultado Correctamente", data);
        } catch (err) {
            next(err);
        }
    }

    async storeChild(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, color, idOpportunityTracking } = req.body;
            const createdBy = req.user!.id;

            await service.storeChild({
                name,
                color,
                idOpportunityTracking: Number(idOpportunityTracking),
                createdBy
            });

            return ApiResponse.success(res, "Almacenado correctamente", true);
        } catch (err) {
            next(err);
        }
    }

    async updateChild(req: Request, res: Response, next: NextFunction) {
        try {
            const idTracking = Number(req.params.idTracking);
            const { name, color } = req.body;

            await service.updateChild(idTracking, { name, color });

            return ApiResponse.success(res, "Actualizado correctamente", true);
        } catch (err) {
            next(err);
        }
    }

    async deleteChild(req: Request, res: Response, next: NextFunction) {
        try {
            const idTracking = Number(req.params.idTracking);

            await service.deleteChild(idTracking);

            return ApiResponse.success(res, "Eliminado correctamente", true);
        } catch (err) {
            next(err);
        }
    }

    async getSelectParentTrackings(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await service.getSelectParentTrackings();
            return ApiResponse.success(res, "consultado correctamente", data);
        } catch (err) {
            next(err);
        }
    }

}
