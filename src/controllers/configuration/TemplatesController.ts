import { Request, Response } from "express";
import { TemplatesService } from "../../services/configuration/TemplatesService";
import { TemplatesRepository } from "../../repositories/configuration/TemplatesRepository";
import { ApiResponse } from "../../utils/apiResponse";

const service = new TemplatesService(new TemplatesRepository());

export class TemplatesController {
  static async getTemplates(req: Request, res: Response) {
    try {
      const data = await service.getAllTemplates();
      return ApiResponse.success(res, "consultado correctamente", data);
    } catch (error) {
      return ApiResponse.error(res, error);
    }
  }

  static async getTemplateDetail(req: Request, res: Response) {
    try {
      const idTemplate = Number(req.params.idTemplate);
      const data = await service.getTemplateDetail(idTemplate);
      return ApiResponse.success(res, "consultado correctamente", data);
    } catch (error) {
      return ApiResponse.error(res, error);
    }
  }

  static async changeTemplateState(req: Request, res: Response) {
    try {
      const idTemplate = Number(req.params.idTemplate);
      const data = await service.changeTemplateState(idTemplate);
      return ApiResponse.success(res, "Actualziado correctamente", data);
    } catch (error) {
      return ApiResponse.error(res, error);
    }
  }

  static async deleteTemplate(req: Request, res: Response) {
    try {
      const idTemplate = Number(req.params.idTemplate);
      const data = await service.deleteTemplate(idTemplate);
      return ApiResponse.success(res, "Eliinado correctamente", data);
    } catch (error) {
      return ApiResponse.error(res, error);
    }
  }
}
