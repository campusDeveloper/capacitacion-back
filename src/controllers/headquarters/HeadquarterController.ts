import { Request, Response } from "express";
import { IUpdateMainHeadquarterBody, IUpdateUserHeadquarterBody } from "../../interfaces/headquarters/Headquarter";
import { HeadquarterRepository } from "../../repositories/headquarters/HeadquarterRepository";
import { HeadquarterService } from "../../services/headquarters/HeadquarterService";
import { ApiResponse } from "../../utils/apiResponse";

const service = new HeadquarterService(new HeadquarterRepository());

export class HeadquarterController {
    static async getSelectHeadquarters(req: Request, res: Response) {
        try {
            const data = await service.getSelectHeadquarters();
            return ApiResponse.success(res, "consultado correctamente", data);
        } catch (error) {
            return ApiResponse.error(res, error);
        }
    }

    static async getActiveHeadquarters(req: Request, res: Response) {
        try {
            const data = await service.getActiveHeadquarters();
            return ApiResponse.success(res, "consultado correctamente", data);
        } catch (error) {
            return ApiResponse.error(res, error);
        }
    }

    static async getUserHeadquarters(req: Request, res: Response) {
        try {
            const data = await service.getUserHeadquarters(Number(req.params.idUser));
            return ApiResponse.success(res, "Almacenado correctamente", data);
        } catch (error) {
            return ApiResponse.error(res, error);
        }
    }

    static async updateMainHeadquarter(req: Request, res: Response) {
        try {
            const body: IUpdateMainHeadquarterBody = req.body;
            const data = await service.updateMainHeadquarter(Number(req.params.idUser), body);
            return ApiResponse.success(res, "Almacenado correctamente", data);
        } catch (error) {
            return ApiResponse.error(res, error);
        }
    }

    static async updateUserHeadquarter(req: Request, res: Response) {
        try {
            const body: IUpdateUserHeadquarterBody = req.body;
            const data = await service.updateUserHeadquarter(Number(req.params.idUser), body);
            return ApiResponse.success(res, "Almacenado correctamente", data);
        } catch (error) {
            return ApiResponse.error(res, error);
        }
    }
}
