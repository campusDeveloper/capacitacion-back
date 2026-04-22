import { Request } from "express";
import { Response } from "express";
import { CustomerTypeService } from "../../services/customerType/CustomerTypeService";


export class CustomerTypeController {
    async getAll(req: Request, res: Response) {
        try {
            const service = new CustomerTypeService();

            const tiposCliente = await service.getAllCustomerTypes();

            return res.status(200).json({
                message: "consultado correctamente",
                data: tiposCliente
            });
            
        } catch (error) {
            
            console.error("Error al consultar tipos de cliente:", error);
            return res.status(500).json({
                message: "Error interno del servidor al consultar los datos",
                error: error
            });
        }
    }
}