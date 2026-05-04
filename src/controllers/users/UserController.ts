import { Request, Response } from "express"
import { UserService } from "../../services/users/UserService"
import { UserRepository } from "../../repositories/users/UserRepository";
import { ApiResponse } from "../../utils/apiResponse";
import { IUserBody, IUserHeadUpdateBody, IUserSubHeadUpdateBody, IUserUpdateBody } from "../../interfaces/users/User";

const service = new UserService(new UserRepository());
export class UserController {
  constructor(private readonly userService: UserService) { }

  getUser = async (req: Request, res: Response): Promise<Response> => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "Usuario no identificado en la petición" })
      }

      const userId = req.user.id

      const data = await this.userService.getUserById(userId)

      return ApiResponse.success(res, "Consultado correctamente", data)

    } catch (error) {
      return ApiResponse.error(res, error)
    }
  }
  //- Listar todo
  static async getAllUsers(req: Request, res: Response) {
    try {
      const data = await service.getAllUsers();
      return ApiResponse.success(res, "Consultados correctamente", data);
    } catch (error) {
      return ApiResponse.error(res, error);
    }
  }
  //- Listar sedes por usuario todo
  static async getSubHeadquartersByUser(req: Request, res: Response) {
    try {
      const data = await service.getSubHeadquartersByUser(Number(req.params.idUser));
      return ApiResponse.success(res, "Consultado correctamente", data);
    } catch (error) {
      return ApiResponse.error(res, error);
    }
  }
  //- Crear uno
  static async createUser(req: Request, res: Response) {
    try {
      const body: IUserBody = req.body;
      const data = await service.createUser(body, req.user!.id);
      return ApiResponse.success(res, 'Almacenado correctamente', data);
    } catch (error) {
      return ApiResponse.error(res, error);
    }
  }
  //- Actulizar uno
  static async updateUser(req: Request, res: Response): Promise<string | any> {
    try {
      const idUser = Number(req.params.idUser);
      const body: IUserUpdateBody = req.body;
      const data = await service.updateUser(idUser, body, req.user!.id);
      return ApiResponse.success(res, 'Actualizado correctamente', data);
    } catch (error) {
      return ApiResponse.error(res, error);
    }
  }

  // Mostra sedes en estado activo
async getHeadquarters(req: Request, res: Response) {
  try {
    const idUser = Number(req.params.IdUser); 

    if (isNaN(idUser)) {
      throw new Error('El ID de usuario proporcionado no es válido');
    }
    const data = await this.userService.getSubHeadquartersByUser(idUser);

    return ApiResponse.success(res, 'consultado correctamente', data);
    
  } catch (error) {
    return ApiResponse.error(res, error);
  }
}
  //- Actulizar SEDE principal
  static async updateUsersHeadquarter(req: Request, res: Response): Promise<string | any> {
    try {
      const idUser = Number(req.params.idUser);
      const body: IUserHeadUpdateBody = req.body;
      const data = await service.updateUsersHeadquarter(idUser, body, req.user!.id);
      return ApiResponse.success(res, 'Actualizado correctamente', data);
    } catch (error) {
      return ApiResponse.error(res, error);
    }
  }
  //- Actulizar SEDE secundaria
  static async updateUsersSubHeadquarter(req: Request, res: Response): Promise<string | any> {
    try {
      const idUser = Number(req.params.idUser);
      const body: IUserSubHeadUpdateBody = req.body;
      const data = await service.updateUsersSubHeadquarter(idUser, body, req.user!.id);
      return ApiResponse.success(res, 'Actualizado correctamente', data);
    } catch (error) {
      return ApiResponse.error(res, error);
    }
  }
  //- Eliminar uno
  static async deleteUser(req: Request, res: Response) {
      try {
        const idUser = Number(req.params.idUser);
        const deletedRows = await service.deleteUser(idUser);
        
        if (deletedRows === 0) {
          return ApiResponse.error(res, 'No se encontró el usuario para eliminar');
        }

        return ApiResponse.success(res, 'Eliminado Correctamente', true);
      } catch (error) {
        return ApiResponse.error(res, error);
      }
    }
  // actualiiizar estado del usuario
  static async updateStateUser(req: Request, res: Response) {
    try {
      const idUser = Number(req.params.idUser);
      const state = Number(req.body.state);

      await service.updateState(idUser, state);
      return ApiResponse.success(res, "Actualizado correctamente", true);

    } catch (error) {
      return ApiResponse.error(res, error);
    }
  }


  //-
  static async switchStatus(req: Request, res: Response) {
    try {
      const idUser = Number(req.params.idUser);
      const data = await service.switchStatus(idUser, req.user!.id);
      return ApiResponse.success(res, "Estado cambiado exitosamente", data);
    } catch (error) {
      return ApiResponse.error(res, error);
    }
  }
}
