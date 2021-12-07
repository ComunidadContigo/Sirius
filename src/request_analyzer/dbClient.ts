import { Pool, QueryResult } from "pg";
import { RefreshToken } from "src/auth/models/auth.model";
import Buddy from "src/buddy/models/buddy.model";
import ReqModel from "src/buddy/models/request.model";
import Requester from "src/buddy/models/requester.model";
import User from "src/user/models/user.model";

export type BuddyWithExpoToken = RefreshToken & User & Buddy & Requester;

export const getBuddiesWithExpoTokens = async (
  db: Pool
): Promise<BuddyWithExpoToken[]> => {
  const query =
    'SELECT * FROM "user" NATURAL JOIN buddy NATURAL JOIN refreshtoken NATURAL JOIN requester WHERE expo_push_token IS NOT NULL';
  const queryRes: QueryResult<BuddyWithExpoToken> = await db.query(query);
  if (queryRes.rowCount < 0) {
    throw new Error("No buddies in database!");
  }
  return queryRes.rows;
};

export const getUnfulfilledRequests = async (db: Pool): Promise<ReqModel[]> => {
  const query = "SELECT * FROM request WHERE stat = 'UNFULFILLED'";
  const queryRes: QueryResult<ReqModel> = await db.query(query);
  if (queryRes.rowCount < 0) {
    return [];
  }
  return queryRes.rows;
};

export const cancelRequest = async (
  db: Pool,
  rq_id: number
): Promise<boolean> => {
  const query = `UPDATE request SET stat = 'CANCELLED' WHERE rq_id = ${rq_id}`;
  return (await db.query(query)).rowCount === 1;
};
