import Sequelize from "sequelize";
import { Opportunity } from "../../models/Opportunity";
import { Headquarter } from "../../models/Headquarter";
import { User } from "../../models/User";
import { Exception } from "../../models/Exception";
import { sequelize } from "../../config/database";

export class OpportunityRepository {
  static async getLeads() {
    return await Opportunity.findAll({
      
      
      //where: {
        //idReservation: { [Op.is]: null } 
      //},
      
      order: [['checkInDate', 'DESC']],
      attributes: {
        include: [
          [
            Sequelize.literal(`(
              SELECT COUNT(DISTINCT c.id)
              FROM customerOpportunityComments c
              WHERE c.IdOpportunity IN (
                SELECT o2.id
                FROM opportunities o2
                WHERE o2.identification = Opportunity.identification
              )
              OR c.IdCustomer IN (
                SELECT cu.id
                FROM customers cu
                WHERE cu.identification = Opportunity.identification
              )
            )`),
            'countComments'
          ],

          [
            Sequelize.literal(`(
              SELECT lastConnection
              FROM chats AS chat
              WHERE chat.idOpportunity = Opportunity.id
              ORDER BY chat.createdAt DESC
              LIMIT 1
            )`),
            'lastConnection'
          ]
        ]
      },
      include: [
        { model: Headquarter, attributes: ['name'], required: false },
        { model: User, as: 'UserAssigned', attributes: ['name', 'specialAgent', 'paymentAgent'], required: false },
        { model: Exception, attributes: ['name'], required: false }
      ]
    });
  }
  // Buscar oportunidad por ID para validar que exista
  static async findById(id: number) {
    return await Opportunity.findByPk(id);
  }

  // Actualizar el estado de interés
  static async updateInterestState(idOpportunity: number, idOpportunityState: number) {
    return await Opportunity.update(
      { idOpportunityState: idOpportunityState },
      { where: { id: idOpportunity } }
    );
  }

  static async updateAssignedUser(idOpportunity: number, idUser: number) {
    const userExists = await User.findByPk(idUser);
    
    if (!userExists) {
      throw new Error(`El usuario con ID ${idUser} no existe en el sistema.`);
    }

    const [affectedRows] = await Opportunity.update(
      { idUserAssigned: idUser },
      { where: { id: idOpportunity } }
    );

    return affectedRows > 0;
  }

  static async getOpportunityCommentsByOpportunityId(idOpportunity: number) {
    const [rows] = await sequelize.query(
      `
      SELECT DISTINCT
        c.id AS IdComment,
        c.Comment AS Comment,
        c.createdAt AS CreatedAt,
        COALESCE(u.name, 'Sin responsable') AS user
      FROM customerOpportunityComments c
      INNER JOIN opportunities o ON o.id = :idOpportunity
      LEFT JOIN users u ON u.id = c.CreatedBy
      WHERE c.IdOpportunity IN (
        SELECT o2.id
        FROM opportunities o2
        WHERE o2.identification = o.identification
      )
      OR c.IdCustomer IN (
        SELECT cu.id
        FROM customers cu
        WHERE cu.identification = o.identification
      )
      ORDER BY c.createdAt DESC
      `,
      {
        replacements: { idOpportunity },
      }
    );

    return rows as Array<{
      IdComment: number;
      Comment: string;
      CreatedAt: Date;
      user: string;
    }>;
  }

  static async createOpportunityComment(idOpportunity: number, comment: string, createdBy: number) {
    const transaction = await sequelize.transaction();
    try {
      const opportunity = await Opportunity.findByPk(idOpportunity, { transaction });
      if (!opportunity) {
        throw new Error("Oportunidad no encontrada");
      }

      await sequelize.query(
        `
        INSERT INTO customerOpportunityComments
          (IdOpportunity, IdCustomer, Comment, CreatedBy, createdAt, updatedAt)
        VALUES
          (:idOpportunity, :idCustomer, :comment, :createdBy, NOW(), NOW())
        `,
        {
          replacements: {
            idOpportunity,
            idCustomer: opportunity.idCustomer ?? null,
            comment,
            createdBy,
          },
          transaction,
        }
      );

      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
