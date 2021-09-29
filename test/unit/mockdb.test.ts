import { expect } from "chai";
import { Done } from "mocha";
import PGMock2, { getPool } from "pgmock2";
import { Pool } from "pg";
import DummyController, { DummyTable } from "../tools/dummy.controller";

describe("Mock DB Test", () => {
  let pgmock: PGMock2;
  before(() => {
    pgmock = new PGMock2();
  });
  it("should be able to test a controller with a mocked DB pool connection", (done: Done) => {
    const dc: DummyController = new DummyController();
    const pool: Pool = getPool(pgmock);

    pgmock.add("SELECT * FROM dummy_table;", ["number"], {
      rowCount: 1,
      rows: [{ x: "test", y: "test1" }],
    });

    dc.dummyGet(pool).then((dummy: DummyTable[]) => {
      expect(dummy).to.have.length(1);
      expect(dummy[0].x).to.equal("test");
      expect(dummy[0].y).to.equal("test1");
      done();
    });
  });
});
