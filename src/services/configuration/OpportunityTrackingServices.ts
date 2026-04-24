import { OpportunityTracking } from "../../models/OpportunityTracking";
import { OpportunityTrackingRepository } from "../../repositories/configuration/OpportunityTrackingRepository";

export class OpportunityTrackingServices {
    private repository = new OpportunityTrackingRepository();

   // GET 1
    async getList() {
        const parents = await this.repository.getParents();

        const result = await Promise.all(
            parents.map(async (parent) => {
                const children = await this.repository.getChildrenByParent(parent.id);
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
    
    async getDetails(idTracking: number) {
        const parent = await this.repository.findParentBy(idTracking);
        if (!parent) throw new Error("Estado no encontrado")

        const children = await this.repository.getChildrenDetail(idTracking);

        const subStates = await Promise.all(
            children.map(async (child) => {
                const uses = await this.repository.countUsesByChild(child.id);
                return {
                    idTracking: child.id,
                    name: child.name,
                    color: child.color,
                    uses
                };
            })
        );
        return {
            idTracking: parent.id ,
            name: parent.name, 
            subStates 
        };
    }

    async storeSubState(idParent: number, payload: { name: string; color: string; createdBy: number }): Promise<void> {
        const parent = await this.repository.findParentBy(idParent);
        if (!parent) {
            const error: any = new Error("Estado padre no encontrado");
            error.status = 404;
            throw error;
        }

        await this.repository.createChild({
            name: payload.name,
            color: payload.color,
            idOpportunityTracking: idParent,
            createdBy: payload.createdBy
        });
    }

    async updateSubState(idParent: number, idChild: number, payload: { name: string; color: string }): Promise<void> {
        const child = await this.repository.findChildById(idChild, idParent);
        if (!child) throw new Error("Sub-estado no encontrado");

        await this.repository.updateChild(idChild, idParent, payload);
    }

    async deleteSubState(idParent: number, idChild: number): Promise<void> {
        const child = await this.repository.findChildById(idChild, idParent);
        if (!child) {
            const error: any = new Error("Sub-estado no encontrado");
            error.status = 404;
            throw error;
        }

        const uses = await this.repository.countUsesByChild(idChild);
        if (uses > 0) {
            const error: any = new Error("No se puede eliminar porque el sub-estado tiene usos registrados");
            error.status = 400;
            throw error;
        }

        await this.repository.destroyChild(idChild, idParent);
    }

    async getChildren(parentId: number) {
        const parent = await this.repository.findParentBy(parentId);
        if (!parent) {
            const error: any = new Error("Estado padre no encontrado");
            error.status = 404;
            throw error;
        }

        const children = await this.repository.getChildrenByParent(parentId);

        return Promise.all(
            children.map(async (child) => ({
                idTracking: child.id,
                name: child.name,
                color: child.color,
                state: child.state,
                idOpportunityTracking: child.idOpportunityTracking,
                uses: await this.repository.countUsesByChild(child.id)
            }))
        );
    }

    async storeChild(payload: {
        name: string;
        color: string;
        idOpportunityTracking: number;
        createdBy: number;
    }): Promise<void> {
        const parent = await this.repository.findParentBy(payload.idOpportunityTracking);
        if (!parent) {
            const error: any = new Error("Estado padre no encontrado");
            error.status = 404;
            throw error;
        }

        await this.repository.createChild(payload);
    }

    async updateChild(idTracking: number, payload: { name: string; color: string }): Promise<void> {
        const child = await this.repository.findChildBy(idTracking);
        if (!child) {
            const error: any = new Error("Estado hijo no encontrado");
            error.status = 404;
            throw error;
        }

        await this.repository.updateChildById(idTracking, payload);
    }

    async deleteChild(idTracking: number): Promise<void> {
        const child = await this.repository.findChildBy(idTracking);
        if (!child) {
            const error: any = new Error("Estado hijo no encontrado");
            error.status = 404;
            throw error;
        }

        const uses = await this.repository.countUsesByChild(idTracking);
        if (uses > 0) {
            const error: any = new Error("No se puede eliminar porque el estado hijo tiene usos registrados");
            error.status = 400;
            throw error;
        }

        await this.repository.deleteChild(idTracking);
    }
}
