import { Pool, QueryResult } from "pg";
import bcrypt from "bcrypt";
import { buildUserUpdateByIDQuery } from "../../common/tools/queryBuilder";
import User from "../models/user.model";
import HttpError from "../../common/models/error.model";

export default class UserController {
  private saltRounds = 10;

  public async getUserByEmail(db: Pool, email: string): Promise<User> {
    const query = 'SELECT * FROM "user" WHERE email = $1;';
    const queryResult: QueryResult<User> = await db.query(query, [email]);
    if (queryResult.rowCount == 0)
      throw new HttpError(404, `No user found with email = ${email}`);
    return queryResult.rows[0];
  }

  public async getAllUsers(db: Pool, limit?: number): Promise<User[]> {
    let query: string;
    if (limit && limit > 0) {
      query = `SELECT * FROM "user" LIMIT ${limit};`;
    } else {
      query = 'SELECT * FROM "user";';
    }
    const queryResult: QueryResult<User> = await db.query(query);
    if (queryResult.rowCount == 0)
      throw new HttpError(404, `Database has no users!`);
    return queryResult.rows;
  }

  public async getUserByID(db: Pool, id: number): Promise<User> {
    const query = 'SELECT * FROM "user" WHERE u_id = $1;';
    const queryResult: QueryResult<User> = await db.query(query, [id]);
    if (queryResult.rowCount == 0)
      throw new HttpError(404, `No user found with id = ${id}`);
    return queryResult.rows[0];
  }

  public async createUser(db: Pool, user: User): Promise<boolean> {
    // try to find if a user already exist

    let foundEmail = true;
    try {
      await this.getUserByEmail(db, user.email);
    } catch (e) {
      if (e instanceof HttpError && e.status == 404) {
        foundEmail = false;
      } else {
        throw e;
      }
    }
    if (foundEmail) {
      throw new HttpError(403, "Email already taken!");
    }

    // no matches found, proceed to create account

    const hashedPassword: string = await bcrypt.hash(
      user.password,
      this.saltRounds
    );
    const query =
      'INSERT INTO "user" ' +
      "(email, password, first_name, last_name, birth_date, gender, phone_number, isVetted) " +
      "VALUES ($1, $2, $3, $4, $5, $6, $7, $8);";
    const queryResult: QueryResult = await db.query(query, [
      user.email,
      hashedPassword,
      user.first_name,
      user.last_name,
      new Date(user.birth_date).toISOString(),
      user.gender,
      user.phone_number,
      user.isVetted || false,
    ]);
    return queryResult.rowCount == 1;
  }

  public async updateUserByID(
    db: Pool,
    id: number,
    user: User
  ): Promise<boolean> {
    const query = buildUserUpdateByIDQuery<User>("user", id, user);
    const queryResult: QueryResult = await db.query(query);
    if (queryResult.rowCount == 0)
      throw new HttpError(404, `No user found with id = ${id}`);
    return queryResult.rowCount === 1;
  }

  public async deleteUserByID(db: Pool, id: number): Promise<boolean> {
    const query = `DELETE FROM "user" WHERE u_id = $1;`;
    const queryResult: QueryResult = await db.query(query, [id]);
    if (queryResult.rowCount == 0)
      throw new HttpError(404, `No user found with id = ${id}`);
    return queryResult.rowCount === 1;
  }
}
