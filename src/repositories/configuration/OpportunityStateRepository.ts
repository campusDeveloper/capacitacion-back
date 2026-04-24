import { Transaction, Op } from "sequelize";
import { OpportunityState } from "../../models/OpportunityState";
import { sequelize } from "../../config/database";
import { IOpportunityStateBody, IOpportunityStateUpdateBody } from "../../interfaces/configuration/OpportunityState";

export class OpportunityStateRepository {

  private readonly opportunityAttributes: any[] = [
    'id',
      'name',
      'description', 
      'state', 
      'color', 
      'createdBy', 
      'updatedBy', 
      'createdAt', 
      'updatedAt',
      [
        sequelize.literal(`(
          SELECT COUNT(*)
          FROM opportunities AS o
          WHERE o.idOpportunityState = OpportunityState.id
        )`),
        'uses'
      ]
    ];

async getAllOpportunityStates(): Promise<OpportunityState[]> {
    return await OpportunityState.findAll({
      attributes: this.opportunityAttributes,
      order: [['state', 'DESC']]
    });
  }

  async createOpportunityState(data: IOpportunityStateBody, createdBy: number, transaction?: Transaction): Promise<OpportunityState> {
    // Validación de nombre: usamos un findOne minimalista (sin 'uses') para evitar errores
    const existing = await OpportunityState.findOne({
      where: { name: data.name },
      attributes: ['id'], 
      transaction,
    });

    if (existing) {
      throw new Error(`Ya existe un estado de oportunidad con el nombre ${data.name}`);
    }

    const opportunityStateData = {
      name: data.name,
      description: data.description,
      color: data.color,
      state: data.state ?? 1,
      createdBy: createdBy,
    };

    const nuevo = await OpportunityState.create(opportunityStateData, { transaction });

    // En lugar de llamar a getById, usamos findOne directamente con los atributos completos
    return (await OpportunityState.findOne({
      where: { id: nuevo.id },
      attributes: this.opportunityAttributes,
      transaction
    }))!;
  }

  async updateOpportunityState(id: number, data: IOpportunityStateUpdateBody, updatedBy: number, transaction?: Transaction): Promise<OpportunityState | null> {
    if (data.name) {
      const existing = await OpportunityState.findOne({
        where: {
          name: data.name,
          id: { [Op.ne]: id },
        },
        attributes: ['id'],
        transaction,
      });

      if (existing) {
        throw new Error(`Ya existe un estado de oportunidad con el nombre ${data.name}`);
      }
    }

    await OpportunityState.update(
      { ...data, updatedBy },
      { where: { id }, transaction }
    );

    // Retornamos el objeto actualizado usando findOne con el contador
    return await OpportunityState.findOne({
      where: { id },
      attributes: this.opportunityAttributes,
      transaction
    });
  }

  async deleteOpportunityState(id: number, updatedBy: number, transaction?: Transaction): Promise<void> {
    await OpportunityState.destroy({ where: { id }, transaction });
  }

  async switchStatus(id: number, updatedBy: number, transaction?: Transaction): Promise<OpportunityState> {
    // Buscamos primero para obtener el estado actual
    const record = await OpportunityState.findOne({
      where: { id },
      attributes: this.opportunityAttributes,
      transaction
    });

    if (!record) {
      throw new Error('Estado de oportunidad no encontrado');
    }

    await OpportunityState.update(
      {
        state: record.state ? 0 : 1,
        updatedBy: updatedBy,
      },
      { where: { id }, transaction }
    );

    // Retornamos el registro final con los datos frescos
    return (await OpportunityState.findOne({
      where: { id },
      attributes: this.opportunityAttributes,
      transaction
    }))!;
  }

  async getAllSorted(): Promise<OpportunityState[]> {
    return await this.getAllOpportunityStates();
  }
}