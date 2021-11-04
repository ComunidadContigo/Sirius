import { Done } from "mocha";
import { Pool } from "pg";
import PGMock2, { getPool } from "pgmock2";
import RequestBuddyServer from "../../../src/buddy/api";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { Application, request } from "express";
import ReqModel from "../../../src/buddy/models/request.model";
import HttpResponse from "../../../src/common/models/response.model";
import { buildUpdateByIDQuery } from "../../../src/common/tools/queryBuilder";
import jwt from "jsonwebtoken";
import environment from "../../../src/common/config/environment.config";

describe("Request API connection", () => {
  const pgmock: PGMock2 = new PGMock2();
  const dbPool: Pool = getPool(pgmock);
  chai.use(chaiHttp);
  const app: Application = RequestBuddyServer(dbPool);

  beforeEach(() => {
    pgmock.dropAll();
  });

  const accessToken = jwt.sign(
    { message: "Verified!" },
    environment.secret_key_access
  );

  it("should successfully connect to API | GET /request", (done: Done) => {
    const request1: ReqModel = {
      rq_id: 1,
      request_date: "",
      is_fulfilled: true,
      request_meeting_point: "",
      is_urgent: false,
      request_destination: "",
      is_in_progress: false,
      r_id: 0,
    };

    const request2: ReqModel = {
      rq_id: 2,
      request_date: "",
      is_fulfilled: false,
      request_meeting_point: "",
      is_urgent: false,
      request_destination: "",
      is_in_progress: false,
      r_id: 0,
    };

    const request3: ReqModel = {
      rq_id: 3,
      request_date: "",
      is_fulfilled: false,
      request_meeting_point: "",
      is_urgent: false,
      request_destination: "",
      is_in_progress: false,
      r_id: 0,
    };

    pgmock.add("SELECT * FROM request;", [], {
      rowCount: 3,
      rows: [request1, request2, request3],
    });

    chai
      .request(app)
      .get("/request")
      .set({ Authorization: `Bearer ${accessToken}` })
      .end((err, res) => {
        if (err) done(err);
        const resBody: HttpResponse<ReqModel[]> = res.body; //type check
        expect(resBody.success).to.be.true;
        expect(resBody.returnCode).to.be.eql(200);
        expect(resBody.rowCount).to.eql(3);
        expect(resBody.data).to.not.be.undefined;
        done();
      });
  });

  it("should successfully connect to API | GET /request/new/:id", (done: Done) => {
    const request1: ReqModel = {
      rq_id: 1,
      request_date: "",
      is_fulfilled: true,
      request_meeting_point: "",
      is_urgent: false,
      request_destination: "",
      is_in_progress: false,
      r_id: 0,
    };

    const request2: ReqModel = {
      rq_id: 2,
      request_date: "",
      is_fulfilled: true,
      request_meeting_point: "",
      is_urgent: false,
      request_destination: "",
      is_in_progress: false,
      r_id: 0,
    };

    const request3: ReqModel = {
      rq_id: 3,
      request_date: "",
      is_fulfilled: true,
      request_meeting_point: "",
      is_urgent: false,
      request_destination: "",
      is_in_progress: false,
      r_id: 0,
    };

    pgmock.add(
      "SELECT * FROM request WHERE is_fulfilled = false and is_in_progress = false and b_id = null;",
      [],
      {
        rowCount: 1,
        rows: [request1],
      }
    );

    chai
      .request(app)
      .get("/request/new/1")
      .set({ Authorization: `Bearer ${accessToken}` })
      .end((err, res) => {
        if (err) done(err);
        const resBody: HttpResponse<ReqModel[]> = res.body; //type check
        expect(resBody.success).to.be.true;
        expect(resBody.returnCode).to.be.eql(200);
        expect(resBody.rowCount).to.eql(1);
        expect(resBody.data).to.not.be.undefined;
        done();
      });
  });

  it("should successfully connect to API | GET /request/:id", (done: Done) => {
    const req: ReqModel = {
      rq_id: 1,
      request_date: "",
      is_fulfilled: false,
      request_meeting_point: "",
      is_urgent: false,
      request_destination: "",
      is_in_progress: false,
      r_id: 0,
    };

    pgmock.add("SELECT * FROM request WHERE rq_id = $1;", ["number"], {
      rowCount: 1,
      rows: [req],
    });

    chai
      .request(app)
      .get("/request/1")
      .set({ Authorization: `Bearer ${accessToken}` })
      .end((err, res) => {
        if (err) done(err);
        const resBody: HttpResponse<ReqModel> = res.body; //type check
        expect(resBody.success).to.be.true;
        expect(resBody.returnCode).to.be.eql(200);
        expect(resBody.rowCount).to.be.undefined; // get request by id does not return rowCount
        expect(resBody.data).to.not.be.undefined;
        done();
      });
  });

  it("should successfully connect to API | POST /request", (done: Done) => {
    const req: ReqModel = {
      rq_id: 1,
      request_date: "",
      is_fulfilled: true,
      request_meeting_point: "",
      is_urgent: false,
      request_destination: "",
      is_in_progress: false,
      r_id: 0,
    };

    const query =
      "INSERT INTO request " +
      "(request_date, is_fulfilled, request_meeting_point, is_urgent, is_in_progress, request_destination, r_id) " +
      "VALUES ($1, $2, $3, $4, $5, $6, $7);";

    pgmock.add(
      query,
      ["string", "boolean", "string", "boolean", "boolean", "string", "number"],
      {
        rowCount: 1,
      }
    );

    chai
      .request(app)
      .post("/request/")
      .send(req)
      .set({ Authorization: `Bearer ${accessToken}` })
      .end((err, res) => {
        const resBody: HttpResponse<ReqModel> = res.body; //type check
        expect(resBody.success).to.be.true;
        expect(resBody.returnCode).to.be.eql(201);
        expect(resBody.rowCount).to.be.undefined; // this route does not return rowCount
        expect(resBody.data).to.be.undefined; // this route does not return data
        done();
      });
  });

  it("should successfully connect to API | PUT /request/:id", (done: Done) => {
    const req: ReqModel = {
      request_date: "",
      is_fulfilled: true,
      request_meeting_point: "",
      is_urgent: false,
      request_destination: "",
      is_in_progress: false,
      r_id: 0,
    };

    const query = buildUpdateByIDQuery<ReqModel>("request", "rq_id", 1, req);

    pgmock.add(query, ["number"], {
      rowCount: 1,
    });

    chai
      .request(app)
      .put("/request/1")
      .send(req)
      .set({ Authorization: `Bearer ${accessToken}` })
      .end((err, res) => {
        if (err) done(err);
        const resBody: HttpResponse<ReqModel> = res.body; //type check
        expect(resBody.success).to.be.true;
        expect(resBody.returnCode).to.be.eql(202);
        expect(resBody.rowCount).to.be.undefined; // this route does not return rowCount
        expect(resBody.data).to.be.undefined; // this route does not return data
        done();
      });
  });

  it("should successfully connect to API | DELETE /request/:id", (done: Done) => {
    pgmock.add("DELETE FROM request WHERE rq_id = $1;", ["number"], {
      rowCount: 1,
    });

    chai
      .request(app)
      .delete("/request/1")
      .set({ Authorization: `Bearer ${accessToken}` })
      .end((err, res) => {
        if (err) done(err);
        const resBody: HttpResponse<ReqModel> = res.body; //type check
        expect(resBody.success).to.be.true;
        expect(resBody.returnCode).to.be.eql(203);
        expect(resBody.rowCount).to.be.undefined; // this route does not return rowCount
        expect(resBody.data).to.be.undefined; // this route does not return data
        done();
      });
  });

  it("should give an error | GET /request 404", (done: Done) => {
    pgmock.add("SELECT * FROM request", [], {
      rowCount: 0,
      rows: [],
    });

    chai
      .request(app)
      .get("/request")
      .set({ Authorization: `Bearer ${accessToken}` })
      .end((err, res) => {
        if (err) done(err);
        const resBody: HttpResponse<ReqModel[]> = res.body; //type check
        expect(resBody.success).to.be.false;
        expect(resBody.returnCode).to.be.eql(404);
        expect(resBody.errors[0]).to.be.eql("Database has no requests!");
        done();
      });
  });
});
