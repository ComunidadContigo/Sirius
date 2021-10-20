import { Done } from "mocha";
import { Pool } from "pg";
import PGMock2, { getPool } from "pgmock2";
import RequestServer from "../../../src/request/api";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { Application } from "express";

describe("Request API connection", () => {
  const pgmock: PGMock2 = new PGMock2();
  const dbPool: Pool = getPool(pgmock);
  chai.use(chaiHttp);
  const app: Application = RequestServer(dbPool);

  it("should successfully connect to API", (done: Done) => {
    chai
      .request(app)
      .get("/")
      .end((err, res) => {
        expect(res.text).to.be.equal("Server running!");
        done();
      });
  });
});
