import { Pool, QueryResult } from "pg";

export default class DummyController {
  public async dummyGet(db: Pool): Promise<DummyTable[]> {
    const query = "SELECT * FROM dummy_table;";
    const queryResult: QueryResult<DummyTable> = await db.query(query);
    return queryResult.rows;
  }
}

export interface DummyTable {
  x: string;
  y: string;
}
