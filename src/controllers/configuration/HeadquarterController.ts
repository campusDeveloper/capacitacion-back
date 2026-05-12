import { Request, Response, NextFunction } from 'express';
import { HeadquarterService } from '../../services/headquarter/HeadquarterService';
import { HeadquarterRepository } from '../../repositories/headquarters/HeadquarterRepository';
import { ApiResponse } from '../../utils/apiResponse';

const service = new HeadquarterService(new HeadquarterRepository());

export class HeadquarterController {
  // TAREA A: LISTADO GENERAL 
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
      return ApiResponse.success(res, 'consultado correctamente', null);
    } catch (error) {
      next(error);
    }
  }
  // TAREA B: DETALLE Y GESTIÓN DE CONOCIMIENTO 
  // 1. Listado Detallado (Sede -> Categorías -> Docs)
  static async getHeadquarterDetailList(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      // Puede ser un número o la palabra "general"
      const idParam = req.params.idHeadquarter === 'general' ? 'general' : Number(req.params.idHeadquarter);
      const data = await service.getHeadquarterDetailList(idParam);
      
      return ApiResponse.success(res, 'consultado correctamente', data);
    } catch (error) {
      next(error);
    }
  }

  // 2. Gestión de Categorías
  static async switchKnowledgeState(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const idKnowledge = Number(req.params.idKnowledge);
      await service.switchKnowledgeState(idKnowledge);
      return ApiResponse.success(res, 'Actualizado correctamente', true);
    } catch (error) {
      next(error);
    }
  }

  static async deleteKnowledge(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const idKnowledge = Number(req.params.idKnowledge);
      await service.deleteKnowledge(idKnowledge);
      return ApiResponse.success(res, 'consultado correctamente', true);
    } catch (error) {
      next(error);
    }
  }

  // 3. Gestión de Documentos
  static async switchDocState(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const idDoc = Number(req.params.idDoc);
      await service.switchDocState(idDoc);
      return ApiResponse.success(res, 'Actualizado correctamente', true);
    } catch (error) {
      next(error);
    }
  }

  static async deleteDoc(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const idDoc = Number(req.params.idDoc);
      await service.deleteDoc(idDoc);
      return ApiResponse.success(res, 'consultado correctamente', true);
    } catch (error) {
      next(error);
    }
  }
  // --- ENDPOINTS PARA CREAR/EDITAR ---

  static async createKnowledge(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const data = await service.createKnowledge(req.body, req.user!.id);
      return ApiResponse.success(res, 'Categoría creada correctamente', data);
    } catch (error) {
      next(error);
    }
  }

  static async updateKnowledge(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const idKnowledge = Number(req.params.idKnowledge);
      const data = await service.updateKnowledge(idKnowledge, req.body);
      return ApiResponse.success(res, 'Categoría actualizada correctamente', data);
    } catch (error) {
      next(error);
    }
  }

  static async createDoc(req: Request, res: Response, next: NextFunction): Promise<any> {
  try {
    if (!req.files || !req.files.file) {
      return ApiResponse.error(res, new Error('El archivo PDF es obligatorio'), 400);
    }
    
    const file = req.files.file as any;
    const { name } = req.body;
    const idKnowledge = Number(req.body.idKnowledge); 
    
    if (!idKnowledge) {
      return ApiResponse.error(res, new Error('idKnowledge es obligatorio'), 400);
    }

    const data = await service.createDoc(idKnowledge, name, file, req.user!.id);
    return ApiResponse.success(res, 'Documento subido y creado correctamente', data);
  } catch (error) {
    next(error);
  }
}
}