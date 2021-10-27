import { Done } from "mocha";
import { Pool } from "pg";
import PGMock2, { getPool } from "pgmock2";
import RequestBuddyServer from "../../../src/buddy/api";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { Application } from "express";
import Buddy from "../../../src/buddy/models/buddy.model";
import HttpResponse from "../../../src/common/models/response.model";
import { buildUpdateByIDQuery } from "../../../src/common/tools/queryBuilder";
import jwt from "jsonwebtoken";
import environment from "../../../src/common/config/environment.config";
import ReqModel from "../../../src/request/models/request.model";

describe("Buddy API connection", () => {
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

  it("should successfully connect to API | GET /buddy", (done: Done) => {
    const buddy1: Buddy = {
      b_id: 1,
      availability: "",
      is_active: false,
      buddy_rating_avg: 0,
      u_id: 0,
    };

    const buddy2: Buddy = {
      b_id: 2,
      availability: "",
      is_active: false,
      buddy_rating_avg: 0,
      u_id: 0,
    };

    const buddy3: Buddy = {
      b_id: 3,
      availability: "",
      is_active: false,
      buddy_rating_avg: 0,
      u_id: 0,
    };

    pgmock.add("SELECT * FROM buddy;", [], {
      rowCount: 3,
      rows: [buddy1, buddy2, buddy3],
    });

    chai
      .request(app)
      .get("/buddy")
      .set({ Authorization: `Bearer ${accessToken}` })
      .end((err, res) => {
        if (err) done(err);
        const resBody: HttpResponse<Buddy[]> = res.body; //type check
        expect(resBody.success).to.be.true;
        expect(resBody.returnCode).to.be.eql(200);
        expect(resBody.rowCount).to.eql(3);
        expect(resBody.data).to.not.be.undefined;
        done();
      });
  });

  it("should successfully connect to API | GET /buddy/active_buddies", (done: Done) => {
    const buddy1: Buddy = {
      b_id: 1,
      availability: "",
      is_active: true,
      buddy_rating_avg: 0,
      u_id: 0,
    };

    const buddy2: Buddy = {
      b_id: 2,
      availability: "",
      is_active: true,
      buddy_rating_avg: 0,
      u_id: 0,
    };

    const buddy3: Buddy = {
      b_id: 3,
      availability: "",
      is_active: false,
      buddy_rating_avg: 0,
      u_id: 0,
    };

    const request1: ReqModel = {
      rq_id: 1,
      request_date: "",
      is_fulfilled: true,
      request_meeting_point: "",
      is_urgent: false,
      request_destination: "",
    };

    const request2: ReqModel = {
      rq_id: 2,
      request_date: "",
      is_fulfilled: false,
      request_meeting_point: "",
      is_urgent: false,
      request_destination: "",
    };

    const request3: ReqModel = {
      rq_id: 3,
      request_date: "",
      is_fulfilled: false,
      request_meeting_point: "",
      is_urgent: false,
      request_destination: "",
    };

    pgmock.add("Select * FROM request WHERE is_fulfilled = false;", [], {
      rowCount: 2,
      rows: [request2, request3],
    });

    pgmock.add("SELECT * FROM buddy WHERE is_active = true;", [], {
      rowCount: 2,
      rows: [buddy1, buddy2],
    });

    chai
      .request(app)
      .get("/buddy/active_buddies")
      .set({ Authorization: `Bearer ${accessToken}` })
      .end((err, res) => {
        if (err) done(err);
        const resBody: HttpResponse<Buddy[]> = res.body; //type check
        expect(resBody.success).to.be.true;
        expect(resBody.returnCode).to.be.eql(200);
        expect(resBody.rowCount).to.eql(2);
        expect(resBody.data).to.not.be.undefined;
        done();
      });
  });

  it("should successfully connect to API | GET /buddy/:id", (done: Done) => {
    const buddy: Buddy = {
      b_id: 1,
      availability: "",
      is_active: false,
      buddy_rating_avg: 0,
      u_id: 0,
    };

    pgmock.add("SELECT * FROM buddy WHERE b_id = $1;", ["number"], {
      rowCount: 1,
      rows: [buddy],
    });

    chai
      .request(app)
      .get("/buddy/1")
      .set({ Authorization: `Bearer ${accessToken}` })
      .end((err, res) => {
        if (err) done(err);
        const resBody: HttpResponse<Buddy> = res.body; //type check
        expect(resBody.success).to.be.true;
        expect(resBody.returnCode).to.be.eql(200);
        expect(resBody.rowCount).to.be.undefined; // get buddy by id does not return rowCount
        expect(resBody.data).to.not.be.undefined;
        done();
      });
  });

  it("should successfully connect to API | POST /buddy", (done: Done) => {
    const buddy: Buddy = {
      availability: "",
      is_active: false,
      buddy_rating_avg: 0,
      u_id: 0,
    };

    const query =
      "INSERT INTO buddy " +
      "(availability, is_active, buddy_rating_avg, u_id) " +
      "VALUES ($1, $2, $3, $4);";

    pgmock.add(query, ["string", "boolean", "number", "number"], {
      rowCount: 1,
    });

    chai
      .request(app)
      .post("/buddy/")
      .send(buddy)
      .set({ Authorization: `Bearer ${accessToken}` })
      .end((err, res) => {
        const resBody: HttpResponse<Buddy> = res.body; //type check
        expect(resBody.success).to.be.true;
        expect(resBody.returnCode).to.be.eql(201);
        expect(resBody.rowCount).to.be.undefined; // this route does not return rowCount
        expect(resBody.data).to.be.undefined; // this route does not return data
        done();
      });
  });

  it("should successfully connect to API | PUT /buddy/:id", (done: Done) => {
    const buddy: Buddy = {
      b_id: 1,
      availability: "",
      is_active: false,
      buddy_rating_avg: 0,
      u_id: 0,
    };

    const query = buildUpdateByIDQuery<Buddy>("buddy", "b_id", 1, buddy);

    pgmock.add(query, ["number"], {
      rowCount: 1,
    });

    chai
      .request(app)
      .put("/buddy/1")
      .send(buddy)
      .set({ Authorization: `Bearer ${accessToken}` })
      .end((err, res) => {
        if (err) done(err);
        const resBody: HttpResponse<Buddy> = res.body; //type check
        expect(resBody.success).to.be.true;
        expect(resBody.returnCode).to.be.eql(202);
        expect(resBody.rowCount).to.be.undefined; // this route does not return rowCount
        expect(resBody.data).to.be.undefined; // this route does not return data
        done();
      });
  });

  it("should successfully connect to API | DELETE /buddy/:id", (done: Done) => {
    pgmock.add("DELETE FROM buddy WHERE b_id = $1;", ["number"], {
      rowCount: 1,
    });

    chai
      .request(app)
      .delete("/buddy/1")
      .set({ Authorization: `Bearer ${accessToken}` })
      .end((err, res) => {
        if (err) done(err);
        const resBody: HttpResponse<Buddy> = res.body; //type check
        expect(resBody.success).to.be.true;
        expect(resBody.returnCode).to.be.eql(203);
        expect(resBody.rowCount).to.be.undefined; // this route does not return rowCount
        expect(resBody.data).to.be.undefined; // this route does not return data
        done();
      });
  });

  it("should give an error | GET /buddy 404", (done: Done) => {
    pgmock.add("SELECT * FROM buddy", [], {
      rowCount: 0,
      rows: [],
    });

    chai
      .request(app)
      .get("/buddy")
      .set({ Authorization: `Bearer ${accessToken}` })
      .end((err, res) => {
        if (err) done(err);
        const resBody: HttpResponse<Buddy[]> = res.body; //type check
        expect(resBody.success).to.be.false;
        expect(resBody.returnCode).to.be.eql(404);
        expect(resBody.errors[0]).to.be.eql("Database has no buddies!");
        done();
      });
  });
});
