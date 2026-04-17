import { User } from "../models/User"

export class AuthRepository {
  async login(email: string): Promise<User | null> {
    return await User.findOne({ where: { email }, raw: true })
  }
}
