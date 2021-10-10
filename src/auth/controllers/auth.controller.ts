import { Pool } from "pg";
import User from "@user/models/user.model";
import UserController from "@user/controllers/user.controller";
import bcrypt from "bcrypt";
import HttpError from "@common/models/error.model";

export default class AuthController {
  public async authenticate(
    db: Pool,
    email: string,
    password: string
  ): Promise<User> {
    const uc: UserController = new UserController();
    const user = await uc.getUserByEmail(db, email);
    const verifyPassword = await bcrypt.compare(password, user.password);
    if (verifyPassword) {
      return user;
    } else {
      throw new HttpError(401, "Wrong Credentials!");
    }
  }
}
