import { Pool, QueryResult } from "pg";
import { buildUpdateByIDQuery } from "../../common/tools/queryBuilder";
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

  public async getRequestByisFulfilled(db: Pool): Promise<ReqModel[]> {
    const query = "SELECT * FROM request WHERE stat = '' and b_id = null;";
    const queryResult: QueryResult<ReqModel> = await db.query(query);
    if (queryResult.rowCount == 0)
      throw new HttpError(404, `No requests needs to be fulfilled right now.`);
    return queryResult.rows;
  }

  public async getRequestByID(db: Pool, id: number): Promise<ReqModel> {
    const query = "SELECT * FROM request WHERE rq_id = $1;";
    const queryResult: QueryResult<ReqModel> = await db.query(query, [id]);
    if (queryResult.rowCount == 0)
      throw new HttpError(404, `No request found with id = ${id}`);
    return queryResult.rows[0];
  }

  public async createRequest(db: Pool, request: ReqModel): Promise<number> {
    const query =
      "INSERT INTO request " +
      "(request_date, request_meeting_point, stat, request_destination, r_id) " +
      "VALUES ($1, $2, $3, $4, $5) RETURNING rq_id;";
    const queryResult: QueryResult = await db.query(query, [
      request.request_date,
      request.request_meeting_point,
      request.stat,
      request.request_destination,
      request.r_id,
    ]);

    return queryResult.rows[0];
  }

  public async updateRequestByID(
    db: Pool,
    id: number,
    request: ReqModel
  ): Promise<boolean> {
    const query = buildUpdateByIDQuery<ReqModel>(
      "request",
      "rq_id",
      id,
      request
    );
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

  public async findNewEligibleRequests(
    db: Pool,
    id: number
  ): Promise<ReqModel[]> {
    //Check if there are requests to be fulfilled.
    const query = "SELECT * FROM request WHERE stat = '' and b_id = null;";
    const queryResult: QueryResult<ReqModel> = await db.query(query);
    if (queryResult.rowCount == 0)
      throw new HttpError(404, `No requests needs to be fulfilled right now.`);

    //Geolocation implementation goes here. Not yet tho
    //Here we access the user location

    return queryResult.rows;
  }
}
