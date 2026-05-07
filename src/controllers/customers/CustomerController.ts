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
}