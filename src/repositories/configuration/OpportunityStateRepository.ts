import { Transaction, Op } from "sequelize";
import { OpportunityState } from "../../models/OpportunityState";
import { sequelize } from "../../config/database";
import { IOpportunityStateBody, IOpportunityStateUpdateBody } from "../../interfaces/configuration/OpportunityState";

export class OpportunityStateRepository {
  async getAllOpportunityStates(): Promise<OpportunityState[]> {
    return await OpportunityState.findAll();
  }

  async getOpportunityStateById(id: number): Promise<OpportunityState | null> {
    return await OpportunityState.findByPk(id);
  }

  async getOpportunityStateByName(name: string): Promise<OpportunityState | null> {
    return await OpportunityState.findOne({
      where: { name: name },
    });
  }

  async createOpportunityState(data: IOpportunityStateBody, createdBy: number, transaction?: Transaction): Promise<OpportunityState> {
    // Validar unicidad de name
    const existing = await OpportunityState.findOne({
      where: { name: data.name },
      transaction,
    });

    if (existing) {
      throw new Error(`Ya existe un estado de oportunidad con el nombre ${data.name}`);
    }

    const OpportunityStateData: any = {
      name: data.name,
      description: data.description,
      color: data.color,
      state: data.state ?? 1,
      createdBy: createdBy,
    };
    return await OpportunityState.create(OpportunityStateData, { transaction });
  }

  async updateOpportunityState(id: number, data: IOpportunityStateUpdateBody, updatedBy: number, transaction?: Transaction): Promise<OpportunityState | null> {
    // Validar unicidad de name si se está cambiando
    if (data.name) {
      const existing = await OpportunityState.findOne({
        where: {
          name: data.name,
          id: { [Op.ne]: id },
        },
        transaction,
      });

      if (existing) {
        throw new Error(`Ya existe un estado de oportunidad con el nombre ${data.name}`);
      }
    }

    const OpportunityStateData: any = {
      name: data.name,
      description: data.description,
      color: data.color,
      state: data.state,
      updatedBy: updatedBy,
    };

    await OpportunityState.update(OpportunityStateData, {
      where: { id: id },
      transaction,
    });

    return await this.getOpportunityStateById(id);
  }

  async deleteOpportunityState(id: number, updatedBy: number, transaction?: Transaction): Promise<void> {
    await OpportunityState.destroy({ where: { id: id }, transaction });
  }

  async switchStatus(id: number, updatedBy: number, transaction?: Transaction): Promise<OpportunityState> {
    const OpportunityState = await this.getOpportunityStateById(id);

    if (!OpportunityState) {
      throw new Error('Estado de oportunidad no encontrado');
    }

    return await OpportunityState.update(
      {
        state: OpportunityState.state ? 0 : 1,
        updatedBy: updatedBy,
      },
      { transaction }
    );
  }

  async getAllSorted(): Promise<OpportunityState[]> {
    return await OpportunityState.findAll({
      order: [['state', 'DESC']],
    });
  }
}
