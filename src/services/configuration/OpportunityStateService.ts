import { OpportunityStateRepository } from "../../repositories/configuration/OpportunityStateRepository";
import { IOpportunityStateBody, IOpportunityStateUpdateBody } from "../../interfaces/configuration/OpportunityState";
import { sequelize } from "../../config/database";
import { OpportunityState, OpportunityState } from "../../models/OpportunityState";

export class OpportunityStateService {
  private repo: OpportunityStateRepository;

  constructor(repository: OpportunityStateRepository) {
    this.repo = repository;
  }

  async getAllOpportunityStates(): Promise<OpportunityState[]> {
    return await this.repo.getAllSorted();
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
    const opportunityState = await OpportunityState.findOne({
        where: { id },
        attributes: [
            'id', 'name', 'description', 'state', 'color', 'createdBy', 'updatedBy', 'createdAt', 'updatedAt',
            [
                sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM opportunities AS o
                    WHERE o.idOpportunityState = OpportunityState.id
                )`),
                'uses'
            ]
        ]
    });
    if (!opportunityState) {
        throw new Error("Estado de oportunidad no encontrado");
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
