import  {UsersPermissions} from "../../models/UsersPermissions";

export class UsersPermissionRepository {
  async findOne(idUser: number, module: number) {
    return await UsersPermissions.findOne({ where: { idUser, module } });
  }

  async findOrCreate(idUser: number, module: number, id: number) {
    return await UsersPermissions.findOrCreate({
      where: { idUser, module },
      defaults: { idUser, module, createdBy: id },
    });
  }

  async delete(idUser: number, module: number) {
    return await UsersPermissions.destroy({ where: { idUser, module } });
  }

  async deleteBulk(whereClause: object) {
    return await UsersPermissions.destroy({ where: { whereClause } });
  }
}
