import { Op, Transaction } from "sequelize";
import { OpportunityTracking } from "../../models/OpportunityTracking";
import { Opportunity } from "../../models/Opportunity";

export class OpportunityTrackingRepository {

    // POST /api/configuration/tracking-opportunities
    async getParents(): Promise<OpportunityTracking[]> {
        return OpportunityTracking.findAll({
            where: { idOpportunityTracking: null},
            attributes: ["id", "name", "color", "state"],
            order: [["state", "DESC"]]
        });
    }

    async getActiveParentsForSelect(): Promise<OpportunityTracking[]> {
        return OpportunityTracking.findAll({
            where: {
                state: 1,
                idOpportunityTracking: { [Op.is]: null }
            },
            attributes: ["id", "name", "color"],
            order: [["name", "ASC"]]
        });
    }


    async countChildren(parentId: number): Promise<number> {
        return OpportunityTracking.count({
            where: { idOpportunityTracking: parentId }
        });
    }

    async countUses(childrenIds: number[], transaction?: Transaction): Promise<number> {
        if (childrenIds.length === 0) return 0;
        return Opportunity.count({
            where: { idOpportunityTracking: {[Op.in]: childrenIds } },
            transaction
        });
    }

    //POST /store

    async createParent(data: {name: string; color: string; createdBy: number}, transaction?: Transaction): Promise<OpportunityTracking> {
        return OpportunityTracking.create({
            name: data.name,
            color: data.color,
            state: 1,
            idOpportunityTracking: null,
            createdBy: data.createdBy,
        }, { transaction });
    }

    async createChild(data: {name: string; color: string; idOpportunityTracking: number; createdBy: number}, transaction?: Transaction): Promise<OpportunityTracking> {
        return OpportunityTracking.create({
            name: data.name,
            color: data.color,
            state: 1,
            idOpportunityTracking: data.idOpportunityTracking,
            createdBy: data.createdBy,
        }, { transaction })
    }

    // PUT /:idTracking/update

    async updateParent (idTracking: number, data: {name: string, color: string}, transaction?: Transaction): Promise<void> {
        await OpportunityTracking.update(
            { name: data.name,
                color: data.color,
            },
            {
                where: { id: idTracking, idOpportunityTracking: null },
                transaction
            }
        );
    }


    // PUT /{idTracking}/update-state

    async findParentBy(idTracking: number, transaction?: Transaction): Promise<OpportunityTracking | null> {
        return OpportunityTracking.findOne({
            where: { id: idTracking, idOpportunityTracking: null},
            transaction
        });
    }

    async updateState(idTracking: number, newState: number, transaction?: Transaction): Promise<void> {
        await OpportunityTracking.update(
            { state: newState },
            { where: { id: idTracking, idOpportunityTracking: null }, transaction }
        );
    }

    // DELETE /{idTracking}/delete

    async getChildrensIds(idTracking: number, transaction?: Transaction): Promise<number[]> {
        const children = await OpportunityTracking.findAll({
            where: { idOpportunityTracking: idTracking},
            attributes: ["id"],
            transaction
        });
        return children.map((c) => c.id)
    }

    async deleteParent(idTracking: number, transaction?: Transaction): Promise<void> {
        await OpportunityTracking.destroy({
            where: { id: idTracking, idOpportunityTracking: null},
            transaction
        });
    }

    // GET api/configuration/tracking-opportunity/{idTracking}/detail

    async getChildrenDetail(idTracking: number) {
        return OpportunityTracking.findAll({
            where: { idOpportunityTracking: idTracking }
        });
    }

    async countUsesByChild(idChild: number, transaction?: Transaction) {
        return Opportunity.count({
            where: { idOpportunityTracking: idChild },
            transaction
        });
    }

    async findChildById(idChild: number, idParent: number, transaction?: Transaction): Promise<OpportunityTracking | null> {
        return OpportunityTracking.findOne({
            where: { id: idChild, idOpportunityTracking: idParent },
            transaction
        });
    }

    async updateChild(idChild: number, idParent: number, data: { name: string; color: string }, transaction?: Transaction): Promise<void> {
        await OpportunityTracking.update(
            { name: data.name, color: data.color },
            { where: { id: idChild, idOpportunityTracking: idParent }, transaction }
        );
    }

    async destroyChild(idChild: number, idParent: number, transaction?: Transaction): Promise<void> {
        await OpportunityTracking.destroy({
            where: { id: idChild, idOpportunityTracking: idParent },
            transaction
        });
    }

    async getChildrenByParent(parentId: number): Promise<OpportunityTracking[]> {
        return OpportunityTracking.findAll({
            where: { idOpportunityTracking: parentId },
            attributes: ["id", "name", "color", "state", "idOpportunityTracking"],
            order: [["id", "ASC"]]
        });
    }

    async findChildBy(idTracking: number, transaction?: Transaction): Promise<OpportunityTracking | null> {
        return OpportunityTracking.findOne({
            where: {
                id: idTracking,
                idOpportunityTracking: { [Op.ne]: null }
            },
            transaction
        });
    }

    async updateChildById(idTracking: number, data: { name: string; color: string }, transaction?: Transaction): Promise<void> {
        await OpportunityTracking.update(
            { name: data.name, color: data.color },
            {
                where: {
                    id: idTracking,
                    idOpportunityTracking: { [Op.ne]: null }
                },
                transaction
            }
        );
    }

    async deleteChild(idTracking: number, transaction?: Transaction): Promise<void> {
        await OpportunityTracking.destroy({
            where: {
                id: idTracking,
                idOpportunityTracking: { [Op.ne]: null }
            },
            transaction
        });
    }

}
