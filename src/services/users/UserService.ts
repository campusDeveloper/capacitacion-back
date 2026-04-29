import { Transaction } from "sequelize";
import { sequelize } from "../../config/database";
import { IUserBody, IUserHeadUpdateBody, IUserSubHeadUpdateBody, IUserUpdateBody } from "../../interfaces/users/User";
import { UserRepository } from "../../repositories/users/UserRepository";

export class UserService {
  private repo: UserRepository;

  constructor(repository: UserRepository) {
    this.repo = repository;
  }

  async getAllUsers() {
    const usersDB = await this.repo.getAllUsers();

    return usersDB.map((user) => {
      const userData = user.toJSON();
      const mainHq = userData.headquarters?.find(
        (hq: any) => hq.UserHeadquarter?.main === 1
      );

      return {
        id: userData.id,
        type: userData.type,
        name: userData.name,
        email: userData.email,
        headquarter: mainHq ? mainHq.name : null,
        countHeadquarters: userData.headquarters ? userData.headquarters.length : 0,
        specialAgent: userData.specialAgent,
        paymentAgent: userData.paymentAgent,
        state: userData.state,
      };
    });
  }

  async updateState(idUser: number, state: number) {
    return await this.repo.updateStateUser(idUser, state);
  }

  async getUserById(id: number) {
    const user = await this.repo.getUserById(id);

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    return user;
  }

  async createUser(body: IUserBody, createdBy: number) {
    return sequelize.transaction(async (transaction) => {
      const existingUser = await this.repo.getUserByEmail(body.email, transaction);
      if (existingUser) {
        throw new Error("EMAIL_EXISTS");
      }

      const headquarterIds = this.buildHeadquarterIds(body.mainHeadquarter, body.headquarters);
      await this.validateHeadquartersExist(headquarterIds, transaction);

      const newUser = await this.repo.createUser(body, createdBy, transaction);
      const idUser = newUser.id;

      await this.repo.assignHeadquarters(
        [
          {
            idUser,
            idHeadquarter: body.mainHeadquarter,
            main: 1,
            createdBy,
          },
          ...(body.headquarters ?? []).map((idHeadquarter) => ({
            idUser,
            idHeadquarter,
            main: 0,
            createdBy,
          })),
        ],
        transaction
      );

      return true;
    });
  }

  async updateUser(idUser: number, body: IUserUpdateBody, updatedBy: number) {
    return sequelize.transaction(async (transaction) => {
      const user = await this.repo.getUserByIdUser(idUser, transaction);
      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      await this.validateHeadquartersExist([body.mainHeadquarter], transaction);
      await this.repo.updateUser(idUser, body, updatedBy, transaction);
      await this.setMainHeadquarter(idUser, body.mainHeadquarter, updatedBy, transaction);

      return true;
    });
  }

  async updateUsersHeadquarter(idUser: number, body: IUserHeadUpdateBody, updatedBy: number) {
    return sequelize.transaction(async (transaction) => {
      const user = await this.repo.getUserByIdUser(idUser, transaction);
      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      await this.validateHeadquartersExist([body.idHeadquarter], transaction);
      await this.setMainHeadquarter(idUser, body.idHeadquarter, updatedBy, transaction);

      return true;
    });
  }

  async updateUsersSubHeadquarter(idUser: number, body: IUserSubHeadUpdateBody, updatedBy: number) {
    return sequelize.transaction(async (transaction) => {
      const user = await this.repo.getUserByIdUser(idUser, transaction);
      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      await this.validateHeadquartersExist([body.idHeadquarter], transaction);
      const relation = await this.repo.getUserHeadquarter(idUser, body.idHeadquarter, transaction);

      if (body.value === 1) {
        if (relation?.main === 1) {
          throw new Error("La sede ya es la sede principal del usuario");
        }

        if (!relation) {
          await this.repo.createUserHeadquarter(
            { idUser, idHeadquarter: body.idHeadquarter, main: 0, createdBy: updatedBy },
            transaction
          );
        }

        return true;
      }

      if (body.value === 0) {
        if (relation?.main === 1) {
          throw new Error("No se puede eliminar la sede principal como secundaria");
        }

        await this.repo.deleteUserHeadquarter(idUser, body.idHeadquarter, transaction);
        return true;
      }

      throw new Error("El valor debe ser 0 o 1");
    });
  }

  async deleteUser(idUser: number) {
    return sequelize.transaction(async (transaction) => {
      return await this.repo.deleteUser(idUser, transaction);
    });
  }

  async switchStatus(idUser: number, updatedBy: number) {
    return sequelize.transaction(async (transaction) => {
      return await this.repo.switchStatus(idUser, updatedBy, transaction);
    });
  }

  async getSubHeadquartersByUser(idUser: number) {
    const user = await this.repo.getUserByIdUser(idUser);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    return user.headquarters;
  }

  private buildHeadquarterIds(mainHeadquarter: number, headquarters: number[] = []) {
    const allIds = [mainHeadquarter, ...headquarters];
    const repeatedId = allIds.find((id, index) => allIds.indexOf(id) !== index);

    if (repeatedId) {
      throw new Error(`La sede ${repeatedId} esta repetida para el usuario`);
    }

    return allIds;
  }

  private async validateHeadquartersExist(ids: number[], transaction?: Transaction) {
    const uniqueIds = [...new Set(ids)];
    const headquarters = await this.repo.getHeadquartersByIds(uniqueIds, transaction);

    if (headquarters.length !== uniqueIds.length) {
      const existingIds = headquarters.map((headquarter) => headquarter.id);
      const missingIds = uniqueIds.filter((id) => !existingIds.includes(id));
      throw new Error(`Sede(s) no encontrada(s): ${missingIds.join(", ")}`);
    }
  }

  private async setMainHeadquarter(
    idUser: number,
    idHeadquarter: number,
    updatedBy: number,
    transaction?: Transaction
  ) {
    const relation = await this.repo.getUserHeadquarter(idUser, idHeadquarter, transaction);

    await this.repo.clearMainHeadquarter(idUser, transaction);

    if (relation) {
      await this.repo.updateUserHeadquarter(
        idUser,
        idHeadquarter,
        { main: 1 },
        transaction
      );
      return;
    }

    await this.repo.createUserHeadquarter(
      { idUser, idHeadquarter, main: 1, createdBy: updatedBy },
      transaction
    );
  }
}
