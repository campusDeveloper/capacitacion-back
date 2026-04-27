import { Request, Response, NextFunction } from 'express'; 
import { HeadquarterService } from '../../services/headquarter/HeadquarterService';
import { HeadquarterRepository } from '../../repositories/headquarters/HeadquarterRepository';
import { ApiResponse } from '../../utils/apiResponse';

const service = new HeadquarterService(new HeadquarterRepository());

export class HeadquarterController {

  static async getHeadquartersWithKnowledge(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const data = await service.getHeadquartersWithKnowledge();
      return ApiResponse.success(res, 'consultado correctamente', data);
    } catch (error) {
      next(error); 
    }
  }

  static async switchState(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const id = Number(req.params.id);
      
      await service.switchState(id, req.user!.id);
      
      // ✅ 3. El requerimiento de tu documento pide este mensaje exacto y sin data
      return ApiResponse.success(res, 'consultado correctamente', null); 
    } catch (error) {
      next(error); // ✅ 2. Pasar el error al middleware global
    }
  }
}