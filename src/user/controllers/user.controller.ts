import { Pool, QueryResult } from "pg";
import { buildUpdateByIDQuery } from "../../common/tools/queryBuilder";
import User from "../models/user.model";

export default class UserController {
  public async getAllUsers(db: Pool, limit?: number): Promise<User[]> {
    let query: string;
    if (limit && limit > 0) {
      query = `SELECT * FROM "user" LIMIT ${limit};`;
    } else {
      query = 'SELECT * FROM "user";';
    }
    const queryResult: QueryResult<User> = await db.query(query);
    return queryResult.rows;
  }

  public async getUserByID(db: Pool, id: number): Promise<User> {
    const query = `SELECT * FROM "user" WHERE id = ${id};`;
    const queryResult: QueryResult<User> = await db.query(query);
    return queryResult.rows[0];
  }

  public async createUser(db: Pool, user: User): Promise<boolean> {
    const query = `INSERT INTO "user" 
        (email, password, user_name, phone_number, user_rating) VALUES 
        ('${user.email || ""}',
        '${user.password || ""}', 
        '${user.user_name || ""}', 
        '${user.phone_number || ""}', 
        '${user.user_rating || 0}')`;
    const queryResult: QueryResult = await db.query(query);
    return queryResult.rowCount == 1;
  }

  public async updateUserByID(
    db: Pool,
    id: number,
    user: User
  ): Promise<boolean> {
    const query = buildUpdateByIDQuery<User>("user", id, user);
    const queryResult: QueryResult = await db.query(query);
    return queryResult.rowCount === 1;
  }

  public async deleteUserByID(db: Pool, id: number): Promise<boolean> {
    const query = `DELETE FROM "user" WHERE id = ${id};`;
    const queryResult: QueryResult = await db.query(query);
    return queryResult.rowCount === 1;
  }
}
