import { Op } from "sequelize";
import { OpportunityTracking } from "../../models/OpportunityTracking";
import { Opportunity } from "../../models/Opportunity"
import { addColors } from "winston/lib/winston/config";

export class OpportunityTrackingRepository {

    // POST /api/configuration/tracking-opportunities
    async getParents(): Promise<OpportunityTracking[]> {
        return OpportunityTracking.findAll({
            where: { idOpportunityTracking: null},
            attributes: ["id", "name", "color", "state"],
            order: [["state", "DESC"]]
        });
    }

    async countChildren(parentId: number): Promise<number> {
        return OpportunityTracking.count({
            where: { idOpportunityTracking: parentId }
        });
    }

    async countUses(childrenIds: number[]): Promise<number> {
        if (childrenIds.length === 0) return 0;
        return Opportunity.count({
            where: { idOpportunityTracking: {[Op.in]: childrenIds } },
        });
    }

    //POST /store

    async createParent(data: {name: string; color: string; createdBy: number}): Promise<OpportunityTracking> {
        return OpportunityTracking.create({
            name: data.name,
            color: data.color,
            state: 1,
            idOpportunityTracking: null,
            createdBy: data.createdBy,
        });
    }

    async createChild(data: {name: string; color: string; idOpportunityTracking: number; createdBy: number}): Promise<OpportunityTracking> {
        return OpportunityTracking.create({
            name: data.name,
            color: data.color,
            state: 1,
            idOpportunityTracking: data.idOpportunityTracking,
            createdBy: data.createdBy,
        })
    }

    // PUT /:idTracking/update

    async updateParent (idTracking: number, data: {name: string, color: string}): Promise<void> {
        await OpportunityTracking.update(
            { name: data.name,
                color: data.color,
            },
            {
                where: { id: idTracking, idOpportunityTracking: null }
            }
        );
    }


    // PUT /{idTracking}/update-state

    async findParentBy(idTracking: number): Promise<OpportunityTracking | null> {
        return OpportunityTracking.findOne({
            where: { id: idTracking, idOpportunityTracking: null}
        });
    }

    async updateState(idTracking: number, newState: number): Promise<void> {
        { state: newState }
        { where: { id: idTracking }}
    }

    // DELETE /{idTracking}/delete

    async getChildrensIds(idTracking: number): Promise<number[]> {
        const children = await OpportunityTracking.findAll({
            where: { idOpportunityTracking: idTracking},
            attributes: ["id"]
        });
        return children.map((c) => c.id)
    }

    async deleteParent(idTracking: number): Promise<void> {
        await OpportunityTracking.destroy({
            where: { id: idTracking, idOpportunityTracking: null}
        });
    }

}