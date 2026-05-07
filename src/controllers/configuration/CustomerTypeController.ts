import { Request, Response } from "express";
import { CustomerTypeService } from "../../services/configuration/CustomerTypeService";
import { ApiResponse } from "../../utils/apiResponse";
import { CustomerTypeRepository } from "../../repositories/configuration/CustomerTypeRepository";

const service = new CustomerTypeService(new CustomerTypeRepository());

export class CustomerTypeController {
    static async getAll(req: Request, res: Response) {
        try {
            const data = await service.getAllCustomerTypes();
            return ApiResponse.success(res, "Consultado correctamente", data);
        } catch (error) {
            return ApiResponse.error(res, error);
        }
    }

    static async create(req: Request, res: Response) {
        try {
            if (!req.user?.id) {
                return ApiResponse.error(res, new Error("Usuario no identificado en la peticion"), 401);
            }

            const data = await service.createCustomerType(req.body, req.user.id);
            return ApiResponse.success(res, "Guardado correctamente", data, 201);
        } catch (error) {
            return ApiResponse.error(res, error);
        }
    }


    static async update(req: Request, res: Response) {
        try {
            const id = Number(req.params.idType);
            const data = await service.updateCustomerType(id, req.body);
            return ApiResponse.success(res, "Actualizado correctamente", data);
        } catch (error) {
            return ApiResponse.error(res, error);
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const id = Number(req.params.idType);
            const data = await service.deleteCustomerType(id);
            return ApiResponse.success(res, "Eliminado correctamente", data);
        } catch (error) {
            const statusCode =
                error instanceof Error && error.message === "No ha sido encontrado" ? 404 : 400;
            return ApiResponse.error(res, error, statusCode);
        }
    }

    static async updateState(req: Request, res: Response) {
        try {
            const id = Number(req.params.idType);
            const { state } = req.body;
            const data = await service.updateCustomerTypeState(id, state);
            return ApiResponse.success(res, "Estado actualizado correctamente", data);
        } catch (error) {
            const statusCode =
                error instanceof Error && error.message === "No ha sido encontrado" ? 404 : 400;
            return ApiResponse.error(res, error, statusCode);
        }
    }

    static async getActiveCustomerTypes(req: Request, res: Response) {
        try {
            const data = await service.getActiveCustomerTypes();
            return ApiResponse.success(res, "consultado correctamente", data);
        } catch (error) {
            return ApiResponse.error(res, error);
        }
    }
}
