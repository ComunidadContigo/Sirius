import { Done } from "mocha";
import { Pool } from "pg";
import PGMock2, { getPool } from "pgmock2";
import UserServer from "../../../src/user/api";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { Application } from "express";

describe("User API connection", () => {
  const pgmock: PGMock2 = new PGMock2();
  const dbPool: Pool = getPool(pgmock);
  chai.use(chaiHttp);
  const app: Application = UserServer(dbPool);

  it("should successfully connect to API", (done: Done) => {
    chai
      .request(app)
      .get("/health")
      .end((err, res) => {
        expect(res.text).to.be.equal("User server running!");
        done();
      });
  });
});
