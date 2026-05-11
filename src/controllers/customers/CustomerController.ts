import { Request, Response } from "express";
import { CustomerService } from "../../services/customers/CustomerService";
import { ApiResponse } from "../../utils/apiResponse";

const service = new CustomerService();

export class CustomerController {
    static async getCustomersList(req: Request, res: Response) {
        try {
            const { name, date, headquarter } = req.query;
            
            const data = await service.getCustomersList({
                name: name as string | undefined,
                date: date as string | undefined,
                headquarter: typeof headquarter === 'string' ? parseInt(headquarter, 10) : headquarter as number | undefined,
            });
            
            return ApiResponse.success(res, "consultado correctamente", data);
        } catch (error) {
            return ApiResponse.error(res, error);
        }
    }

    static async changeCustomerType(req: Request, res: Response) {
        try {
            const { idCustomer } = req.params;
            const { idType } = req.body;

            const result = await service.changeCustomerType(
                Number(idCustomer),
                Number(idType)
            );

            return ApiResponse.success(res, "actualizado correctamente", result);
        } catch (error) {
            return ApiResponse.error(res, error);
        }
    }

    static async getCustomerReservations(req: Request, res: Response) {
        try {
            const { idCustomer } = req.params;

            const data = await service.getCustomerReservations(Number(idCustomer));

            return ApiResponse.success(res, "consultado correctamente", data);
        } catch (error) {
            return ApiResponse.error(res, error);
        }
    }

    static async getCustomerMessagesHistory(req: Request, res: Response) {
        try {
            const { idCustomer } = req.params;

            const data = await service.getCustomerMessagesHistory(Number(idCustomer));

            return ApiResponse.success(res, "consultado correctamente", data);
        } catch (error) {
            return ApiResponse.error(res, error);
        }
    }

    static async getCustomerComments(req: Request, res: Response) {
        try {
            const { idCustomer } = req.params;

            const data = await service.getCustomerComments(Number(idCustomer));

            return ApiResponse.success(res, "consultado correctamente", data);
        } catch (error) {
            return ApiResponse.error(res, error);
        }
    }

    static async createCustomerComment(req: Request, res: Response) {
        try {
            const { idCustomer } = req.params;
            const { comment } = req.body;
            const userId = (req as any).user.id;

            const result = await service.createCustomerComment(
                Number(idCustomer),
                comment,
                userId
            );

            return ApiResponse.success(res, "Almacenado correctamente", result);
        } catch (error) {
            return ApiResponse.error(res, error);
        }
    }
}