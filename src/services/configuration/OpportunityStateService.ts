import { OpportunityStateRepository } from "../../repositories/configuration/OpportunityStateRepository";
import { IOpportunityStateBody, IOpportunityStateUpdateBody } from "../../interfaces/configuration/OpportunityState";
import { sequelize } from "../../config/database";
import { OpportunityState } from "../../models/OpportunityState";

export class OpportunityStateService {
  private repo: OpportunityStateRepository;

  constructor(repository: OpportunityStateRepository) {
    this.repo = repository;
  }

  async getAllOpportunityStates(): Promise<OpportunityState[]> {
    return await this.repo.getAllSorted();
  }

  async getOpportunityStateById(id: number): Promise<OpportunityState> {
    const OpportunityState = await this.repo.getOpportunityStateById(id);

    if (!OpportunityState) {
      throw new Error("Estado de oportunidad no encontrado");
    }

    return OpportunityState;
  }

  async createOpportunityState(body: IOpportunityStateBody, createdBy: number): Promise<OpportunityState> {
    return sequelize.transaction(async (transaction) => {
      return await this.repo.createOpportunityState(body, createdBy, transaction);
    });
  }

  async updateOpportunityState(id: number, body: IOpportunityStateUpdateBody, updatedBy: number): Promise<OpportunityState> {
    return sequelize.transaction(async (transaction) => {
      const updated = await this.repo.updateOpportunityState(id, body, updatedBy, transaction);
      if (!updated) {
        throw new Error("Estado de oportunidad no encontrado");
      }
      return updated;
    });
  }

  async deleteOpportunityState(id: number, updatedBy: number): Promise<void> {
    // Validación de negocio: verificar si el estado está en uso
    const OpportunityState = await this.repo.getOpportunityStateById(id);
    if (!OpportunityState) {
      throw new Error("Estado de oportunidad no encontrado");
    }
    if (OpportunityState.uses > 0) {
      throw new Error("No se puede eliminar un estado de oportunidad que está en uso");
    }

    return sequelize.transaction(async (transaction) => {
      await this.repo.deleteOpportunityState(id, updatedBy, transaction);
    });
  }

  async switchStatus(id: number, updatedBy: number): Promise<OpportunityState> {
    return sequelize.transaction(async (transaction) => {
      const updated = await this.repo.switchStatus(id, updatedBy, transaction);
      if (!updated) {
        throw new Error("Estado de oportunidad no encontrado");
      }
      return updated;
    });
  }
}
