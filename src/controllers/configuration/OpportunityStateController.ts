import { Request, Response } from "express"
import { OpportunityStateService } from "../../services/configuration/OpportunityStateService";
import { OpportunityStateRepository } from "../../repositories/configuration/OpportunityStateRepository";
import { ApiResponse } from "../../utils/apiResponse";
import { IOpportunityStateBody, IOpportunityStateUpdateBody } from "../../interfaces/configuration/OpportunityState";
import { GetOpportunityStatesQueryPayload } from "../../validators/configuration/OpportunityStateValidator";

const service = new OpportunityStateService(new (OpportunityStateRepository));
export class OpportunityStateController {
  constructor(private readonly OpportunityStateService: OpportunityStateService) { }

  //- Listar todos ordenados por state DESC
  static async getAllOpportunityStates(req: Request, res: Response): Promise<string | any> {
    try {
      const data = await service.getAllOpportunityStates();
      return ApiResponse.success(res, "Consultado correctamente", data);
    } catch (error) {
      return ApiResponse.error(res, error);
    }
  }
  //- Crear nuevo
  static async createOpportunityState(req: Request, res: Response): Promise<string | any> {
    try {
      const body: IOpportunityStateBody = req.body;
      const data = await service.createOpportunityState(body, req.user!.id);
      return ApiResponse.success(res, 'Guardado Correctamente', data);
    } catch (error) {
      return ApiResponse.error(res, error);
    }
  }
  //- Actualizar existente
  static async updateOpportunityState(req: Request, res: Response): Promise<string | any> {
    try {
      const id = Number(req.params.id);
      const body: IOpportunityStateUpdateBody = req.body;
      const data = await service.updateOpportunityState(id, body, req.user!.id);
      return ApiResponse.success(res, 'Guardado Correctamente', data);
    } catch (error) {
      return ApiResponse.error(res, error);
    }
  }
  //- Eliminar (soft delete)
  static async deleteOpportunityState(req: Request, res: Response): Promise<string | any> {
    try {
      const id = Number(req.params.id);
      const data = await service.deleteOpportunityState(id, req.user!.id);
      return ApiResponse.success(res, 'Eliminado Correctamente', data);
    } catch (error) {
      return ApiResponse.error(res, error);
    }
  }
  //- Cambiar estado activo/inactivo
  static async switchStatus(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const data = await service.switchStatus(id, req.user!.id);
      return ApiResponse.success(res, "Estado cambiado exitosamente", data);
    } catch (error) {
      return ApiResponse.error(res, error);
    }
  }
  //- Select de Estados Activos
  static async getSelectStates(req: Request, res: Response): Promise<string | any> {
    try {
      const data = await service.getSelectStates();
      return ApiResponse.success(res, "consultado correctamente", data);
    } catch (error) {
      return ApiResponse.error(res, error);
    }
  }
}
