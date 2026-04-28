import { Transaction, fn, col, literal } from 'sequelize';
import { Headquarter } from '../../models/Headquarter';
import { HeadquarterKnowledge } from '../../models/HeadquarterKnowledge';
import { Doc } from '../../models/Doc';

export class HeadquarterRepository {
  async getHeadquarterById(id: number, transaction?: Transaction): Promise<Headquarter | null> {
    return await Headquarter.findByPk(id, { transaction });
  }

  async getGeneralKnowledgeCounts(): Promise<{ categories: number; docs: number }> {
    const categories = await HeadquarterKnowledge.count({
      where: { idHeadquarter: null },
    });

    const docs = await Doc.count({
      include: [
        {
          model: HeadquarterKnowledge,
          required: true,
          where: { idHeadquarter: null },
        },
      ],
    });

    return { categories, docs };
  }

  async getAllHeadquartersWithCounts(): Promise<Headquarter[]> {
    return await Headquarter.findAll({
      attributes: [
        'id', 'name', 'code', 'state', 'address', 'phone', 'email', 'city',
        [
          literal(`(
            SELECT COUNT(*)
            FROM headquarterKnowledge hk
            WHERE hk.idHeadquarter = Headquarter.id
          )`),
          'categories',
        ],
        [
          literal(`(
            SELECT COUNT(*)
            FROM docs d
            INNER JOIN headquarterKnowledge hk ON hk.id = d.idKnowledge
            WHERE hk.idHeadquarter = Headquarter.id
          )`),
          'docs',
        ],
      ],
      order: [['state', 'DESC']],
      raw: true,
    });
  }

  async switchState(headquarter: Headquarter, updatedBy: number, transaction?: Transaction): Promise<Headquarter> {
    return await headquarter.update(
      {
        state: headquarter.state === 1 ? 0 : 1, 
        updatedBy,
      },
      { transaction }
    );
  }

  // ─── NUEVOS MÉTODOS TAREA B: DETALLE DE CONOCIMIENTO ─────────────────────

  // 1. Obtener categorías y sus documentos anidados
  async getKnowledgeWithDocs(idHeadquarter: number | null): Promise<HeadquarterKnowledge[]> {
    return await HeadquarterKnowledge.findAll({
      where: { idHeadquarter }, 
      include: [
        {
          model: Doc,
          as: 'docs', 
          required: false, 
        },
      ],
      order: [
        ['createdAt', 'ASC'], 
      ],
    });
  }


  async getKnowledgeById(idKnowledge: number, transaction?: Transaction): Promise<HeadquarterKnowledge | null> {
    return await HeadquarterKnowledge.findByPk(idKnowledge, { transaction });
  }

  async switchKnowledgeState(knowledge: HeadquarterKnowledge, transaction?: Transaction): Promise<HeadquarterKnowledge> {
    return await knowledge.update(
      {
        state: knowledge.state === 1 ? 0 : 1, 
      },
      { transaction }
    );
  }

  async deleteKnowledge(knowledge: HeadquarterKnowledge, transaction?: Transaction): Promise<void> {
    await knowledge.destroy({ transaction }); 
  }


  async getDocById(idDoc: number, transaction?: Transaction): Promise<Doc | null> {
    return await Doc.findByPk(idDoc, { transaction });
  }

  async switchDocState(doc: Doc, transaction?: Transaction): Promise<Doc> {
    return await doc.update(
      {
        state: doc.state === 1 ? 0 : 1, 
      },
      { transaction }
    );
  }

  //Docs
  async deleteDoc(doc: Doc, transaction?: Transaction): Promise<void> {
    await doc.destroy({ transaction }); 
  }

  async createKnowledge(data: any, transaction?: Transaction): Promise<HeadquarterKnowledge> {
    return await HeadquarterKnowledge.create(data, { transaction });
  }

  async updateKnowledge(knowledge: HeadquarterKnowledge, data: any, transaction?: Transaction): Promise<HeadquarterKnowledge> {
    return await knowledge.update(data, { transaction });
  }

  async createDoc(data: any, transaction?: Transaction): Promise<Doc> {
    return await Doc.create(data, { transaction });
  }


}