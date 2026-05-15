import { Request, Response } from "express";
import { OpportunityService } from "../../services/opportunities/OpportunityService";

export class OpportunityController {
  
  static async getList(req: Request, res: Response) {
    try {

      const data = await OpportunityService.getLeadsList();

      return res.status(200).json({
        message: "consultado correctamente",
        data: data
      });

    } catch (error) {
      console.error("Error obteniendo el listado de Leads:", error);
      
      return res.status(500).json({ 
        message: "Error al consultar los leads", 
        error: error instanceof Error ? error.message : "Error interno del servidor" 
      });
    }
  }

  // endpoint para cambiar el estado de interes
  static async changeInterestState(req: Request, res: Response) {
    try {
      const idOpportunity = Number(req.params.idOpportunity);
      const { idState } = req.body;

      if (!idState) {
        return res.status(400).json({ 
          message: "El idState es requerido en el body",
          error: "Bad Request" 
        });
      }

      const data = await OpportunityService.changeInterestState(idOpportunity, Number(idState));

      return res.status(200).json({
        message: "actualizado correctamente",
        data: data
      });

    } catch (error) {
      console.error("Error cambiando el estado de la oportunidad:", error);
      
      return res.status(500).json({ 
        message: "Error al actualizar el estado", 
        error: error instanceof Error ? error.message : "Error interno del servidor" 
      });
    }
  }
  
  static async changeAssignedUser(req: Request, res: Response) {
    try {
      const idOpportunity = Number(req.params.idOpportunity);
      const { idUser } = req.body;

      if (!idUser) {
        return res.status(400).json({ 
          message: "El idUser es requerido en el body",
          error: "Bad Request" 
        });
      }

      const data = await OpportunityService.changeAssignedUser(idOpportunity, Number(idUser));

      return res.status(200).json({
        message: "actualizado correctamente",
        data: data
      });

    } catch (error) {
      console.error("Error cambiando el responsable de la oportunidad:", error);
      
      return res.status(500).json({ 
        message: "Error al actualizar el responsable", 
        error: error instanceof Error ? error.message : "Error interno del servidor" 
      });
    }
  }

  static async getComments(req: Request, res: Response) {
    try {
      const idOpportunity = Number(req.params.idOpportunity);

      if (!Number.isInteger(idOpportunity) || idOpportunity <= 0) {
        return res.status(400).json({
          message: "El IdOpportunity es requerido",
          error: "Bad Request"
        });
      }

      const data = await OpportunityService.getOpportunityComments(idOpportunity);

      return res.status(200).json({
        message: "consultado correctamente",
        data
      });
    } catch (error) {
      console.error("Error consultando comentarios de oportunidad:", error);
      return res.status(500).json({
        message: "Error al consultar los comentarios",
        error: error instanceof Error ? error.message : "Error interno del servidor"
      });
    }
  }

  static async createComment(req: Request, res: Response) {
    try {
      const idOpportunity = Number(req.params.idOpportunity);
      const comment = typeof req.body?.comment === "string" ? req.body.comment.trim() : "";

      if (!Number.isInteger(idOpportunity) || idOpportunity <= 0) {
        return res.status(400).json({
          message: "El IdOpportunity es requerido",
          error: "Bad Request"
        });
      }

      if (!comment) {
        return res.status(400).json({
          message: "El Comment es requerido",
          error: "Bad Request"
        });
      }

      if (comment.length > 250) {
        return res.status(400).json({
          message: "El Comment no puede superar 250 caracteres",
          error: "Bad Request"
        });
      }

      const createdBy = req.user?.id;
      if (!createdBy) {
        return res.status(401).json({ message: "No autorizado", error: "Unauthorized" });
      }

      const data = await OpportunityService.createOpportunityComment(idOpportunity, comment, createdBy);

      return res.status(200).json({
        message: "Almacenado correctamente",
        data
      });
    } catch (error) {
      console.error("Error creando comentario de oportunidad:", error);
      return res.status(500).json({
        message: "Error al almacenar comentario",
        error: error instanceof Error ? error.message : "Error interno del servidor"
      });
    }
  }
}
