import { Pool, QueryResult } from "pg";
import { buildUpdateByIDQuery } from "../../common/tools/queryBuilder";
import Requester from "../../buddy/models/requester.model";
import HttpError from "../../common/models/error.model";

export default class RequesterController {
  public async getAllRequesters(
    db: Pool,
    limit?: number
  ): Promise<Requester[]> {
    let query: string;
    if (limit && limit > 0) {
      query = `SELECT * FROM requester LIMIT ${limit};`;
    } else {
      query = "SELECT * FROM requester;";
    }
    const queryResult: QueryResult<Requester> = await db.query(query);
    if (queryResult.rowCount == 0)
      throw new HttpError(404, `Database has no buddies!`);
    return queryResult.rows;
  }

  public async getRequesterByID(db: Pool, id: number): Promise<Requester> {
    const query = "SELECT * FROM requester WHERE r_id = $1;";
    const queryResult: QueryResult<Requester> = await db.query(query, [id]);
    if (queryResult.rowCount == 0)
      throw new HttpError(404, `No requester found with id = ${id}`);
    return queryResult.rows[0];
  }

  public async createRequester(
    db: Pool,
    requester: Requester
  ): Promise<boolean> {
    const query =
      "INSERT INTO requester " +
      "(u_id, requester_rating_avg) " +
      "VALUES ($1, $2);";
    const queryResult: QueryResult = await db.query(query, [
      requester.u_id,
      requester.requester_rating_avg || 0,
    ]);
    return queryResult.rowCount == 1;
  }

  public async updateRequesterByID(
    db: Pool,
    id: number,
    requester: Requester
  ): Promise<boolean> {
    const query = buildUpdateByIDQuery<Requester>(
      "requester",
      "r_id",
      id,
      requester
    );
    const queryResult: QueryResult = await db.query(query);
    if (queryResult.rowCount == 0)
      throw new HttpError(404, `No requester found with id = ${id}`);
    return queryResult.rowCount === 1;
  }

  public async deleteRequesterByID(db: Pool, id: number): Promise<boolean> {
    const query = `DELETE FROM requester WHERE r_id = $1;`;
    const queryResult: QueryResult = await db.query(query, [id]);
    if (queryResult.rowCount == 0)
      throw new HttpError(404, `No requester found with id = ${id}`);
    return queryResult.rowCount === 1;
  }
}
