import { UserRepository } from "../../repositories/users/UserRepository"
import { UserResponseDto } from "../../validators/AuthValidators"
import { IUserBody, IUserHeadUpdateBody, IUserUpdateBody, IUserSubHeadUpdateBody } from "../../interfaces/users/User";
import { sequelize } from "../../config/database";
import { GetUsersQueryPayload } from "../../validators/users/UserValidator";
import { Headquarter } from "../../models/Headquarter";

export class UserService {
  private repo: UserRepository

  constructor(repository: UserRepository) {
    this.repo = repository
  }

  async getAllUsers() {
      const usersDB = await this.repo.getAllUsers()

      const usersClean = usersDB.map((user) => {
      const userData = user.toJSON(); 
        const mainHq = userData.headquarters.find((hq: any) => hq.usersheadquarters.main === 1
        )

        return {
          id: userData.id,
          type: userData.type,
          name: userData.name,
          email: userData.email,
          headquarter: mainHq ? mainHq.name : null, // si se encuentra una sede y hay datos en la variable mainHq, se trae el nombre, y si no encontró nada, asígnalo se asigna como nulo
          paymentAgent: userData.paymentAgent,
          state: userData.state
        }
    });

    return usersClean;
  }

  async getUserById(id: number) {
    const user = await this.repo.getUserById(id)

    if (!user) {
      throw new Error("Usuario no encontrado")
    }

    return user
  }

  //- Crear usuario
  async createUser(body: IUserBody, createdBy: number) {
    const existingUser = await this.repo.getUserByEmail(body.email)
    if (existingUser) {
      return {
        success: false,
        error: 'EMAIL_EXISTS',
        message: 'El email ya existe en el sistema'
      }
    }

    return sequelize.transaction(async (transaction) => {
      return await this.repo.createUser(body, createdBy, transaction);
    });
  }
  //- Actualizar usuario
  async updateUser(idUser: number, body: IUserUpdateBody, updatedBy: number) {
    return sequelize.transaction(async (transaction) => {
      return await this.repo.updateUser(idUser, body, updatedBy, transaction);
    });
  }
  //-Eliminar usuario
  async deleteUser(idUser: number) {
    return sequelize.transaction(async (transaction) => {
      return await this.repo.deleteUser(idUser, transaction);
    });
  }
  //-Cambio de estado de usuario
  async switchStatus(idUser: number, updatedBy: number) {
    return sequelize.transaction(async (transaction) => {
      return await this.repo.switchStatus(idUser, updatedBy, transaction);
    });
  }
}