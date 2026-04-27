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
}