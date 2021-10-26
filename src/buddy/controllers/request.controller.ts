import { Pool, QueryResult } from "pg";
import { buildRequestUpdateByIDQuery } from "../../common/tools/queryBuilder";
import ReqModel from "../models/request.model";
import HttpError from "../../common/models/error.model";

export default class RequestController {
  public async getAllRequests(db: Pool, limit?: number): Promise<ReqModel[]> {
    let query: string;
    if (limit && limit > 0) {
      query = `SELECT * FROM request LIMIT ${limit};`;
    } else {
      query = "SELECT * FROM request;";
    }
    const queryResult: QueryResult<ReqModel> = await db.query(query);
    if (queryResult.rowCount == 0)
      throw new HttpError(404, `Database has no requests!`);
    return queryResult.rows;
  }

  public async getRequestByID(db: Pool, id: number): Promise<ReqModel> {
    const query = "SELECT * FROM request WHERE rq_id = $1;";
    const queryResult: QueryResult<ReqModel> = await db.query(query, [id]);
    if (queryResult.rowCount == 0)
      throw new HttpError(404, `No request found with id = ${id}`);
    return queryResult.rows[0];
  }

  public async createRequest(db: Pool, request: ReqModel): Promise<boolean> {
    const query =
      "INSERT INTO request " +
      "(request_date, isFulfilled, request_meeting_point, isUrgent, request_destination) " +
      "VALUES ($1, $2, $3, $4, $5);";
    const queryResult: QueryResult = await db.query(query, [
      request.request_date,
      request.isFulfilled || false,
      request.request_meeting_point,
      request.isUrgent || false,
      request.request_destination,
    ]);
    return queryResult.rowCount == 1;
  }

  public async updateRequestByID(
    db: Pool,
    id: number,
    request: ReqModel
  ): Promise<boolean> {
    const query = buildRequestUpdateByIDQuery<ReqModel>("request", id, request);
    const queryResult: QueryResult = await db.query(query);
    if (queryResult.rowCount == 0)
      throw new HttpError(404, `No request found with id = ${id}`);
    return queryResult.rowCount === 1;
  }

  public async deleteRequestByID(db: Pool, id: number): Promise<boolean> {
    const query = `DELETE FROM request WHERE rq_id = $1;`;
    const queryResult: QueryResult = await db.query(query, [id]);
    if (queryResult.rowCount == 0)
      throw new HttpError(404, `No request found with id = ${id}`);
    return queryResult.rowCount === 1;
  }
}
