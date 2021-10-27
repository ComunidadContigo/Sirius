import { Pool, QueryResult } from "pg";
import { buildUpdateByIDQuery } from "../../common/tools/queryBuilder";
import Buddy from "../../buddy/models/buddy.model";
import HttpError from "../../common/models/error.model";
import RequestController from "../controllers/request.controller";
import ReqModel from "src/request/models/request.model";

export default class BuddyController {
  requestController: RequestController = new RequestController();
  public async getAllBuddies(db: Pool, limit?: number): Promise<Buddy[]> {
    let query: string;
    if (limit && limit > 0) {
      query = `SELECT * FROM buddy LIMIT ${limit};`;
    } else {
      query = "SELECT * FROM buddy;";
    }
    const queryResult: QueryResult<Buddy> = await db.query(query);
    if (queryResult.rowCount == 0)
      throw new HttpError(404, `Database has no buddies!`);
    return queryResult.rows;
  }

  public async getBuddyByisActive(db: Pool): Promise<Buddy[]> {
    const query = "SELECT * FROM buddy WHERE is_active = true;";
    const queryResult: QueryResult<Buddy> = await db.query(query);
    if (queryResult.rowCount == 0)
      throw new HttpError(404, `No buddy is active right now.`);
    return queryResult.rows;
  }

  public async getBuddyByID(db: Pool, id: number): Promise<Buddy> {
    const query = "SELECT * FROM buddy WHERE b_id = $1;";
    const queryResult: QueryResult<Buddy> = await db.query(query, [id]);
    if (queryResult.rowCount == 0)
      throw new HttpError(404, `No buddy found with id = ${id}`);
    return queryResult.rows[0];
  }

  public async createBuddy(db: Pool, buddy: Buddy): Promise<boolean> {
    const query =
      "INSERT INTO buddy " +
      "(availability, is_active, buddy_rating_avg) " +
      "VALUES ($1, $2, $3);";
    const queryResult: QueryResult = await db.query(query, [
      buddy.availability,
      buddy.is_active || false,
      buddy.buddy_rating_avg,
    ]);
    return queryResult.rowCount == 1;
  }

  public async updateBuddyByID(
    db: Pool,
    id: number,
    buddy: Buddy
  ): Promise<boolean> {
    const query = buildUpdateByIDQuery<Buddy>("buddy", "b_id", id, buddy);
    const queryResult: QueryResult = await db.query(query);
    if (queryResult.rowCount == 0)
      throw new HttpError(404, `No buddy found with id = ${id}`);
    return queryResult.rowCount === 1;
  }

  public async deleteBuddyByID(db: Pool, id: number): Promise<boolean> {
    const query = `DELETE FROM buddy WHERE b_id = $1;`;
    const queryResult: QueryResult = await db.query(query, [id]);
    if (queryResult.rowCount == 0)
      throw new HttpError(404, `No buddy found with id = ${id}`);
    return queryResult.rowCount === 1;
  }

  public async findBuddiesToNotify(db: Pool): Promise<Buddy[]> {
    //Check if there are requests to be fulfilled.
    const query = "SELECT * FROM request WHERE is_fulfilled = false;";
    const queryResult: QueryResult<ReqModel> = await db.query(query);
    if (queryResult.rowCount == 0)
      throw new HttpError(404, `No requests needs to be fulfilled right now.`);

    //Check if there are any buddies active.
    const query2 = "SELECT * FROM buddy WHERE is_active = true;";
    const queryResult2: QueryResult<Buddy> = await db.query(query2);
    if (queryResult2.rowCount == 0)
      throw new HttpError(404, `No buddy is active right now.`);

    return queryResult2.rows;
  }
}
