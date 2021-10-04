import { Pool, QueryResult } from "pg";
import User from "../../user/models/user.model";

export default class AuthController {
  private async getUserByUsername(db: Pool, username: string): Promise<User> {
    const query = `SELECT * FROM "user" WHERE user_name = '${username}';`;
    const queryResult: QueryResult<User> = await db.query(query);
    return queryResult.rows[0];
  }

  private async getUserByEmail(db: Pool, email: string): Promise<User> {
    const query = `SELECT * FROM "user" WHERE user_name = '${email}';`;
    const queryResult: QueryResult<User> = await db.query(query);
    return queryResult.rows[0];
  }

  // public async loginUsingEmail(db: Pool, email: string): Promise<> {
  //   const query = `SELECT * FROM "user" WHERE user_name = '${email}';`;
  //   const queryResult: QueryResult<User> = await db.query(query);

  //   // found the user
  //   if(queryResult.rowCount > 0) {

  //   } else {

  //   }
  // }
}
