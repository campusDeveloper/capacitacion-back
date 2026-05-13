import { UsersPermissionRepository } from "../../repositories/users/UsersPermissionsRepository";
import { UsersPermissions } from "../../models/UsersPermissions";
import { User } from "../../models/User";

export interface IUsersUpdateBody {
    idUser?: number;
    module?: number;
    value: 0 | 1;
}

export class UsersPermissionsService {
    constructor(private repo: UsersPermissionRepository) {}

// src/services/users/UsersPermissionsService.ts

    async getMatrix() {
        const admins = await User.findAll({ 
            attributes: ['id', 'name'],
            order: [['id', 'ASC']] 
        });

        const currentPerms = await UsersPermissions.findAll();

        return admins.map(admin => ({
            idUser: admin.id,
            name: admin.name,
            activeModules: currentPerms
                .filter(p => p.idUser === admin.id)
                .map(p => p.module)
                .sort((a, b) => a - b) 
        }));
    }
    async togglePermission(module: number, idUser: number, value: number, adminId: number) {
        return value === 1 
            ? await this.repo.findOrCreate(idUser, module, adminId)
            : await this.repo.delete(idUser, module);
    }

    async updateBulk(data: IUsersUpdateBody, adminId: number) {
        if (data.idUser) {
            const modules = [1, 2, 3, 4, 5, 6, 7];
            return await Promise.all(modules.map(m => this.togglePermission(m, data.idUser!, data.value, adminId)));
        } else if (data.module) {
            const admins = await User.findAll({ where: { type: 1 } });
            return await Promise.all(admins.map(a => this.togglePermission(data.module!, a.id, data.value, adminId)));
        }
    }
}