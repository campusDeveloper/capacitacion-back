import bcrypt from "bcrypt";
import { InvalidCredentialsException } from "../exceptions/InvalidCredentialsException";
import { AuthRepository } from "../repositories/AuthRepository";
import { UserDto } from "../validators/AuthValidators";


export class AuthService {
  private authRepo: AuthRepository

  constructor(authRepository: AuthRepository) {
    this.authRepo = authRepository
  }

  async login(email: string, password: string): Promise<UserDto> {
    const user = await this.authRepo.login(email)

    if (!user) {
      throw new InvalidCredentialsException()
    }

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      throw new InvalidCredentialsException()
    }

    const { password: _, ...userSafe } = user

    return {
      idUser: userSafe.id,
      name: userSafe.name,
      email: userSafe.email,
    } satisfies UserDto
  }
}
