import { child } from "winston";
import { OpportunityTracking } from "../../models/OpportunityTracking";
import { OpportunityTrackingRepository } from "../../repositories/configuration/OpportunityTrackingRepository";
import { create } from "node:domain";


export class OpportunityTrackingServices {
    private repository = new OpportunityTrackingRepository();

   // GET 1
    async getList() {
        const parents = await this.repository.getParents();

        const result = await Promise.all(
            parents.map(async (parent) => {
                const children = await OpportunityTracking.findAll({
                    where: { idOpportunityTracking: parent.id },
                    attributes: ["id"]
                });
                const childrenIds = children.map((c) => c.id);
                const countChildren = await this.repository.countChildren(parent.id);
                const uses = await this.repository.countUses(childrenIds);

                return {
                    id: parent.id,
                    name: parent.name,
                    color: parent.color,
                    state: parent.state,
                    countChildren,
                    uses,
                };
            })
        );

        return result;
    };

    async store(payload: {
        name: string;
        color: string;
        sub: { name: string; color: string }[];
        createdBy: number;
    }): Promise<void> {
        const parent = await this.repository.createParent({
            name: payload.name,
            color: payload.color,
            createdBy: payload.createdBy,
        });

        for (const sub of payload.sub) {
            await this.repository.createChild({
                name: sub.name,
                color: sub.color,
                idOpportunityTracking: parent.id,
                createdBy: payload.createdBy,
            });
        }
    }

    async update(idTracking: number, payload: {name: string, color: string}): Promise<void> {
        await this.repository.updateParent(idTracking, payload);
    }

    async updateState(idTracking: number): Promise<void> {
        const parent = await this.repository.findParentBy(idTracking); 

        if (!parent) throw new Error("Estado no encontrado");

        const newState = parent.state === 1 ? 0 : 1;
        await this.repository.updateState(idTracking, newState);
    }

    async delete(idTracking: number): Promise <void> {
        const parent = await this.repository.findParentBy(idTracking);
        if (!parent) throw new Error("Estado no encontrado");

        const childrensIds = await this.repository.getChildrensIds(idTracking);

        const uses = await this.repository.countUses(childrensIds);
        if (uses > 0 ) throw new Error("No se puede eliminar porque uno o más sub-estados estan siendo usados");

        await this.repository.deleteParent(idTracking);
    }
    
}