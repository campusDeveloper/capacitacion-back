import { Transaction, Op } from "sequelize";
import { User } from "../../models/User";
import { IUserBody, IUserUpdateBody } from "../../interfaces/users/User";
import bcrypt from "bcrypt";
import { Headquarter } from "../../models/Headquarter";
import { UserHeadquarter } from "../../models/UserHeadquarter";

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

  // En tu repositorio de la relación Usuario-Sede
  async getHeadquartersByUserId(idUser: number, transaction?: Transaction) {
  // Asegúrate de usar el modelo de la tabla intermedia (usersHeadquarters)
    return await UserHeadquarter.findAll({
    where: { idUser: idUser }, // Buscamos todas las filas de este usuario
    attributes: ['idHeadquarter', 'main'], // Solo necesitamos el ID de la sede y si es principal
    transaction,
  });
  }


  //Trae solamente las sedes que estan activas 
  async getActiveHeadquarters() {
  return await Headquarter.findAll({
    where: { 
      state: 1
    },
    attributes: ['id', 'name'] 
  });
}

  //Aqui obtengo todos los usuarios
  async getAllUsers() {
    return await User.findAll({
          attributes: ['id', 'type', 'name', 'state', 'email', 'specialAgent', 'paymentAgent'],
      
      include: [{model: Headquarter,
      through: {attributes: ['main']}
          }],
      order: [['state', 'DESC'], ['name', 'ASC']]
        });
  }

  async getActiveCommercialUsers() {
    return await User.findAll({
      where: {
        type: 2,
        state: 1
      },
      attributes: ['id', 'name'],
      order: [['name', 'ASC']]
    });
  }


  // Cambiar estado de usuario
    async updateStateUser (idUser: number, state: number) {
      return await User.update(
        { state: state },
        {
          where: {
          id: idUser
          }
        }
      );
    }

  //-Obtener uno por idUser
  async getUserByIdUser(idUser: number, transaction?: Transaction): Promise<User | null> {
    return await User.findByPk(idUser, {
      transaction,
      include: [{ model: Headquarter, through: { attributes: ['main'] } }]
    });
  }
  //- Obtener uno por correo
  async getUserByEmail(email: string, transaction?: Transaction): Promise<User | null> {
    return await User.findOne({
      where: { email },
      transaction
    })
  }

  async getHeadquartersByIds(ids: number[], transaction?: Transaction): Promise<Headquarter[]> {
    return await Headquarter.findAll({
      where: { id: { [Op.in]: ids } },
      transaction,
    });
  }

  //-Crear uno
  async createUser(data: IUserBody, createdBy: number, transaction?: Transaction) {
    const SALT_ROUNDS = 10;
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

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
  // eliminar usuaario
  async deleteUser(idUser: number, transaction?: Transaction) {
    return await User.destroy(
      { where: { id: idUser },
       transaction });
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
      },
      { transaction }
    );
  }

  async getUserHeadquarter(idUser: number, idHeadquarter: number, transaction?: Transaction): Promise<UserHeadquarter | null> {
    return await UserHeadquarter.findOne({
      where: { idUser, idHeadquarter },
      transaction,
    });
  }

  async assignHeadquarters(data: Array<{ idUser: number; idHeadquarter: number; main: number; createdBy: number }>, transaction?: Transaction) {
    const records = data.map(item => ({
      idUser: item.idUser,
      idHeadquarter: item.idHeadquarter,
      main: item.main,
      createdBy: item.createdBy,
    }));
    await UserHeadquarter.bulkCreate(records, { transaction });
  }

  async clearMainHeadquarter(idUser: number, transaction?: Transaction) {
    return await UserHeadquarter.update(
      { main: 0 },
      { where: { idUser, main: 1 }, transaction }
    );
  }

  async createUserHeadquarter(data: { idUser: number; idHeadquarter: number; main: number; createdBy: number }, transaction?: Transaction) {
    return await UserHeadquarter.create(
      {
        idUser: data.idUser,
        idHeadquarter: data.idHeadquarter,
        main: data.main,
        createdBy: data.createdBy,
      },
      { transaction }
    );
  }

  async updateUserHeadquarter(
    idUser: number,
    idHeadquarter: number,
    data: { main: number },
    transaction?: Transaction
  ) {
    return await UserHeadquarter.update(
      { main: data.main },
      { where: { idUser, idHeadquarter }, transaction }
    );
  }

  async deleteUserHeadquarter(idUser: number, idHeadquarter: number, transaction?: Transaction) {
    return await UserHeadquarter.destroy({
      where: { idUser, idHeadquarter, main: 0 },
      transaction,
    });
  }
}
