import { Done } from "mocha";
import { Pool } from "pg";
import PGMock2, { getPool } from "pgmock2";
import RequesterBuddyServer from "../../../src/buddy/api";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { Application } from "express";
import Requester from "../../../src/buddy/models/requester.model";
import HttpResponse from "../../../src/common/models/response.model";
import { buildUpdateByIDQuery } from "../../../src/common/tools/queryBuilder";
import jwt from "jsonwebtoken";
import environment from "../../../src/common/config/environment.config";

describe("Requester API connection", () => {
  const pgmock: PGMock2 = new PGMock2();
  const dbPool: Pool = getPool(pgmock);
  chai.use(chaiHttp);
  const app: Application = RequesterBuddyServer(dbPool);

  beforeEach(() => {
    pgmock.dropAll();
  });

  const accessToken = jwt.sign(
    { message: "Verified!" },
    environment.secret_key_access
  );

  it("should successfully connect to API | GET /requester", (done: Done) => {
    const requester1: Requester = {
      r_id: 1,
      requester_rating_avg: 0,
      u_id: 0,
    };

    const requester2: Requester = {
      r_id: 2,
      requester_rating_avg: 0,
      u_id: 0,
    };

    const requester3: Requester = {
      r_id: 3,
      requester_rating_avg: 0,
      u_id: 0,
    };

    pgmock.add("SELECT * FROM requester;", [], {
      rowCount: 3,
      rows: [requester1, requester2, requester3],
    });

    chai
      .request(app)
      .get("/requester")
      .set({ Authorization: `Bearer ${accessToken}` })
      .end((err, res) => {
        if (err) done(err);
        const resBody: HttpResponse<Requester[]> = res.body; //type check
        expect(resBody.success).to.be.true;
        expect(resBody.returnCode).to.be.eql(200);
        expect(resBody.rowCount).to.eql(3);
        expect(resBody.data).to.not.be.undefined;
        done();
      });
  });

  it("should successfully connect to API | GET /requester/:id", (done: Done) => {
    const requester: Requester = {
      r_id: 1,
      requester_rating_avg: 0,
      u_id: 0,
    };

    pgmock.add("SELECT * FROM requester WHERE r_id = $1;", ["number"], {
      rowCount: 1,
      rows: [requester],
    });

    chai
      .request(app)
      .get("/requester/1")
      .set({ Authorization: `Bearer ${accessToken}` })
      .end((err, res) => {
        if (err) done(err);
        const resBody: HttpResponse<Requester> = res.body; //type check
        expect(resBody.success).to.be.true;
        expect(resBody.returnCode).to.be.eql(200);
        expect(resBody.rowCount).to.be.undefined; // get requester by id does not return rowCount
        expect(resBody.data).to.not.be.undefined;
        done();
      });
  });

  it("should successfully connect to API | POST /requester", (done: Done) => {
    const requester: Requester = {
      requester_rating_avg: 0,
      u_id: 0,
    };

    const query =
      "INSERT INTO requester " +
      "(u_id, requester_rating_avg) " +
      "VALUES ($1, $2);";

    pgmock.add(query, ["number", "number"], {
      rowCount: 1,
    });

    chai
      .request(app)
      .post("/requester/")
      .send(requester)
      .set({ Authorization: `Bearer ${accessToken}` })
      .end((err, res) => {
        const resBody: HttpResponse<Requester> = res.body; //type check
        expect(resBody.success).to.be.true;
        expect(resBody.returnCode).to.be.eql(201);
        expect(resBody.rowCount).to.be.undefined; // this route does not return rowCount
        expect(resBody.data).to.be.undefined; // this route does not return data
        done();
      });
  });

  it("should successfully connect to API | PUT /requester/:id", (done: Done) => {
    const requester: Requester = {
      r_id: 1,

      requester_rating_avg: 0,
      u_id: 0,
    };

    const query = buildUpdateByIDQuery<Requester>(
      "requester",
      "r_id",
      1,
      requester
    );

    pgmock.add(query, ["number"], {
      rowCount: 1,
    });

    chai
      .request(app)
      .put("/requester/1")
      .send(requester)
      .set({ Authorization: `Bearer ${accessToken}` })
      .end((err, res) => {
        if (err) done(err);
        const resBody: HttpResponse<Requester> = res.body; //type check
        expect(resBody.success).to.be.true;
        expect(resBody.returnCode).to.be.eql(202);
        expect(resBody.rowCount).to.be.undefined; // this route does not return rowCount
        expect(resBody.data).to.be.undefined; // this route does not return data
        done();
      });
  });

  it("should successfully connect to API | DELETE /requester/:id", (done: Done) => {
    pgmock.add("DELETE FROM requester WHERE r_id = $1;", ["number"], {
      rowCount: 1,
    });

    chai
      .request(app)
      .delete("/requester/1")
      .set({ Authorization: `Bearer ${accessToken}` })
      .end((err, res) => {
        if (err) done(err);
        const resBody: HttpResponse<Requester> = res.body; //type check
        expect(resBody.success).to.be.true;
        expect(resBody.returnCode).to.be.eql(203);
        expect(resBody.rowCount).to.be.undefined; // this route does not return rowCount
        expect(resBody.data).to.be.undefined; // this route does not return data
        done();
      });
  });

  it("should give an error | GET /requester 404", (done: Done) => {
    pgmock.add("SELECT * FROM requester", [], {
      rowCount: 0,
      rows: [],
    });

    chai
      .request(app)
      .get("/requester")
      .set({ Authorization: `Bearer ${accessToken}` })
      .end((err, res) => {
        if (err) done(err);
        const resBody: HttpResponse<Requester[]> = res.body; //type check
        expect(resBody.success).to.be.false;
        expect(resBody.returnCode).to.be.eql(404);
        expect(resBody.errors[0]).to.be.eql("Database has no buddies!");
        done();
      });
  });

  it("should successfully connect to API | GET /requester/user/:id", (done: Done) => {
    const requester: Requester = {
      r_id: 1,
      requester_rating_avg: 0,
      u_id: 0,
    };

    pgmock.add("SELECT * FROM requester WHERE u_id = $1;", ["number"], {
      rowCount: 1,
      rows: [requester],
    });

    chai
      .request(app)
      .get("/requester/user/1")
      .set({ Authorization: `Bearer ${accessToken}` })
      .end((err, res) => {
        if (err) done(err);
        const resBody: HttpResponse<Requester> = res.body; //type check
        expect(resBody.success).to.be.true;
        expect(resBody.returnCode).to.be.eql(200);
        expect(resBody.rowCount).to.be.undefined; // get requester by id does not return rowCount
        expect(resBody.data).to.not.be.undefined;
        done();
      });
  });
});
