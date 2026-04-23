import { Request } from "express";
import { Response } from "express";
import { CustomerTypeService } from "../../services/configuration/CustomerTypeService";


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

    async create(req: Request, res: Response) {
        try {
            const service = new CustomerTypeService();

            const bodyData = req.body;

            if (!bodyData.name || !bodyData.description || !bodyData.color) {
                return res.status(400).json({
                    message: "Los campos 'name', 'description' y 'color' son obligatorios."
                });
            }
            const result = await service.createCustomerType(bodyData);

            return res.status(201).json({
                message: "Almacenado correctamente",
                data: result
            });

        } catch (error) {
            console.error("Error al crear tipo de Cliente", error);
            return res.status(500).json({
                message: "Error interno del servidor al crear datos",
                error: error
            });
        }
    }


    async update(req: Request, res: Response) {
        try {
            const service = new CustomerTypeService();

            const id = Number(req.params.idType);
            const bodyData = req.body;
            const result = await service.updateCustomerType(id, bodyData);

            return res.status(200).json({
                message: "Actualizado correctamente",
                data: result
            });

        } catch (error) {
            console.error("Error al actualizar tipo de Cliente", error);
            return res.status(500).json({
                message: "Error interno del servidor al actualizar los datos",
                error: error
            });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const service = new CustomerTypeService();
            const id = Number(req.params.idType);

            const result = await service.deleteCustomerType(id);

            return res.status(200).json({
                message: "Eliminado correctamente",
                data: result
            });

        } catch (error) {
            if (error === "Este tipo de cliente esta en uso") {
                return res.status(400).json({
                    message: "Tipo de cliente en uso",
                    data: false
                });
            }

            if (error === "No ha sido encontrado") {
                return res.status(404).json({
                    message: error,
                    data: false
                });
            }

            console.error("Error al eliminar Tipo de cliente:", error);
            return res.status(500).json({
                message: "Error interno del servidor al eliminar los datos",
                error: error
            });
        }
    }

    async updateState(req: Request, res: Response) {
    try {
        const service = new CustomerTypeService();
        const id = Number(req.params.idType);
        
        const { state } = req.body;

        const result = await service.updateCustomerTypeState(id, state);

        return res.status(200).json({
            message: "Estado actualizado correctamente",
            data: result
        });

    } catch (error: any) {
        console.error("Error al actualizar el estado:", error);
        return res.status(500).json({
            message: "Error interno al actualizar el estado",
            error: error.message
        });
    }
}

}

