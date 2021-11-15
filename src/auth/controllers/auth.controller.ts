import { Pool, QueryResult } from "pg";
import UserController from "../../user/controllers/user.controller";
import bcrypt from "bcrypt";
import HttpError from "../../common/models/error.model";
import jwt from "jsonwebtoken";
import environmentConfig from "../../common/config/environment.config";
import { RefreshToken, RefreshTokenPayload } from "../models/auth.model";
import User from "src/user/models/user.model";

export default class AuthController {
  public async login(
    db: Pool,
    email: string,
    password: string
  ): Promise<RefreshToken> {
    const uc: UserController = new UserController();
    const user: User = await uc.getUserByEmail(db, email);
    const verifyPassword = await bcrypt.compare(password, user.password);
    if (verifyPassword) {
      const findTokenQuery = "SELECT * FROM refreshtoken WHERE u_id = $1";
      const findTokenRes = await db.query<RefreshToken>(findTokenQuery, [
        user.u_id,
      ]);
      if (findTokenRes.rowCount > 0) {
        const token = findTokenRes.rows[0].token;
        return {
          u_id: user.u_id!,
          token: token,
        };
      }
      // didn't find a token, so create a new one.
      const payload: RefreshTokenPayload = {
        u_id: user.u_id!,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        is_vetted: user.is_vetted!,
      };
      const token = jwt.sign(payload, environmentConfig.secret_key_refresh, {
        expiresIn: "1y",
      });

      const query = "INSERT INTO refreshtoken (u_id, token) VALUES ($1, $2)";
      const queryResult: QueryResult = await db.query(query, [
        user.u_id,
        token,
      ]);
      if (queryResult.rowCount < 1) {
        throw new HttpError(
          500,
          "Something went wrong inserting refresh token into DB"
        );
      }
      return {
        u_id: user.u_id!,
        token: token,
      };
    } else {
      throw new HttpError(401, "Wrong Credentials!");
    }
  }

  public async authenticate(db: Pool, token: RefreshToken): Promise<string> {
    const query = `SELECT * FROM refreshtoken WHERE token = '${token.token}'`;
    const queryResult: QueryResult<RefreshToken> = await db.query(query);
    if (
      queryResult.rowCount < 1 ||
      !jwt.verify(token.token, environmentConfig.secret_key_refresh)
    )
      throw new HttpError(401, `Could not authenticate user ${token.u_id}`);
    return jwt.sign(
      { message: "Verified!" },
      environmentConfig.secret_key_access,
      {
        expiresIn: "15s",
      }
    );
  }

  public async logout(db: Pool, id: number): Promise<boolean> {
    const query = `DELETE FROM refreshtoken WHERE u_id = ${id}`;
    const queryResult: QueryResult = await db.query(query);
    if (queryResult.rowCount < 1)
      throw new HttpError(404, `No refresh token found with u_id = ${id}`);
    return true;
  }
}
