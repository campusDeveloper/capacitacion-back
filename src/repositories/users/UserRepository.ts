import { col, fn, literal, Transaction, Op } from "sequelize";
import { User } from "../../models/User";
import { UserResponseDto } from "../../validators/AuthValidators";
import { IUserBody, IUserHeadUpdateBody, IUserUpdateBody, IUserSubHeadUpdateBody } from "../../interfaces/users/User";
import { sequelize } from "../../config/database"
import { id } from "zod/v4/locales";
import { GetUsersQueryPayload } from "../../validators/users/UserValidator";
import bcrypt from "bcrypt";

export class UserRepository {
  async getUserById(id: number) {
    const user = await User.findByPk(id, {
  attributes: [
    ["id", "idUser"],
    "name",
    "email"
  ]
  
});

if (!user) return null;

const plain = user.toJSON();

return {
  idUser: plain.idUser,
  name: plain.name,
  email: plain.email,
  modules: (plain.permissions ?? []).map((p: { module: number }) => p.module)
};
  }
  //-Obtener uno por idUser
  async getUserByIdUser(idUser: number, transaction?: Transaction): Promise<User | null> {
    return await User.findByPk(idUser, {
      transaction,
    });
  }
  //- Obtener uno por correo
  async getUserByEmail(email: string): Promise<User | null> {
    return await User.findOne({
      where: { email },
      raw: true
    })
  }

  //-Crear uno
  async createUser(data: IUserBody, createdBy: number, transaction?: Transaction) {
    const SALT_ROUNDS = 10;

    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    return sequelize.transaction(async (transaction) => {
      const UserData: any = {
        name: data.name,
        type: data.type,
        state: data.state ?? 1,
        email: data.email,
        password: hashedPassword,
        specialAgent: data.specialAgent,
        paymentAgent: data.paymentAgent,
        createdBy: createdBy,
      };
      const usuarioresult = await User.create(UserData, { transaction });
     
      return usuarioresult;
    })
  }
  //-Actualizar uno
  async updateUser(idUser: number, data: IUserUpdateBody, updatedBy: number, transaction?: Transaction) {

    const UserData: any = {
      name: data.name,
      type: data.type,
      state: data.state,
      email: data.email,
      specialAgent: data.specialAgent,
      paymentAgent: data.paymentAgent,
      updatedBy: updatedBy,
    };

    if (data.password !== '' && data.password !== null && data.password !== undefined) {
      const SALT_ROUNDS = 10;
      const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
      UserData.password = hashedPassword;
    }

    // validar email
    if (UserData.email) {
      const existingUser = await User.findOne({
        where: {
          email: UserData.email,
          id: { [Op.ne]: idUser },
        },
        transaction,
      });

      if (existingUser) {
        throw new Error(`Ya existe un usuario con el correo ${UserData.email}`);
      }
    }

    return await User.update(UserData, {
      where: { id: idUser },
      transaction,
    });

  }
  
  async deleteUser(idUser: number, transaction?: Transaction) {
    return await User.destroy({ where: { id: idUser }, transaction });
  }
  //-Cambio de estado de usuario
  async switchStatus(idUser: number, userId: number, transaction?: Transaction) {
    const user = await this.getUserByIdUser(idUser, transaction);

    if (!user) {
      throw new Error('usuario no encontrado');
    }

    return await user.update(
      {
        state: user.state ? 0 : 1,
        updatedBy: userId,
      },
      { transaction }
    );
  }
}
