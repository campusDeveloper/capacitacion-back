import { Request, Response } from "express";
import { ChatService } from "../../services/chats/ChatService";
import { ApiResponse } from "../../utils/apiResponse";

export class ChatController {
    static async getMessagesHistory(req: Request, res: Response) {
        try {
            
            const idOpportunity = Number(req.params.idOpportunity);

            if (isNaN(idOpportunity)) {
                return ApiResponse.error(res, "ID de oportunidad no válido", 400);
            }

            const data = await ChatService.getOpportunityMessages(idOpportunity);

            return ApiResponse.success(res, "consultado correctamente", data);

        } catch (error) {
            console.error("Error al obtener historial de mensajes:", error);
            
            const errorMessage = error instanceof Error ? error.message : "Error desconocido";
            return ApiResponse.error(res, errorMessage);
        }
    }
}