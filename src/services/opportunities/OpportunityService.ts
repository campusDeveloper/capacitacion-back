import { OpportunityRepository } from "../../repositories/opportunities/OpportunityRepository";

export class OpportunityService {
  
  static async getLeadsList() {
    const leads = await OpportunityRepository.getLeads();

    const mapAffiliateCategory = (value: number | null | undefined) => {
      if (value === 1) return "A";
      if (value === 2) return "B";
      if (value === 3) return "C";
      if (value === 4) return "Particular";
      return null;
    };
    
    const formattedLeads = leads.map((lead: any) => {
      const assignedName = lead.UserAssigned?.name ?? "Sin responsable";
      return {
        Id: lead.id,
        Name: lead.name, 
        Phone: lead.phone,
        affiliateCategory: mapAffiliateCategory(lead.affiliateCategory),
        Headquarter: lead.Headquarter ? lead.Headquarter.name : null, 
        checkInDate: lead.checkInDate,
        checkOutDate: lead.checkOutDate,
        RoomType: lead.roomType,
        guests: lead.guests,
        Exception: lead.Exception ? lead.Exception.name : null,
        idOpportunityState: lead.idOpportunityState,
        idOpportunityTracking: lead.idOpportunityTracking,
        idUserAssigned: lead.idUserAssigned,
        UserAssigned: lead.UserAssigned ? lead.UserAssigned : null,
        NameResponsible: assignedName,
        specialAgent: lead.UserAssigned?.specialAgent ?? null,
        paymentAgent: lead.UserAssigned?.paymentAgent ?? null,
        lastConnection: lead.getDataValue('lastConnection') || null,
        countComments: lead.getDataValue('countComments') || 0 
      };
    });

    return formattedLeads;
  }

  static async getOpportunityComments(idOpportunity: number) {
    const opportunity = await OpportunityRepository.findById(idOpportunity);
    if (!opportunity) {
      throw new Error("Oportunidad no encontrada");
    }
    return OpportunityRepository.getOpportunityCommentsByOpportunityId(idOpportunity);
  }

  static async createOpportunityComment(idOpportunity: number, comment: string, createdBy: number) {
    return OpportunityRepository.createOpportunityComment(idOpportunity, comment, createdBy);
  }

  static async changeInterestState(idOpportunity: number, idState: number) {
    const opportunity = await OpportunityRepository.findById(idOpportunity);
    
    if (!opportunity) {
      throw new Error("Oportunidad no encontrada");
    }

    await OpportunityRepository.updateInterestState(idOpportunity, idState);

    return true;
  }

  static async changeAssignedUser(idOpportunity: number, idUser: number) {
    const success = await OpportunityRepository.updateAssignedUser(idOpportunity, idUser);
    
    if (!success) {
      throw new Error("No se pudo actualizar: Oportunidad no encontrada");
    }

    return true;
  }
}
