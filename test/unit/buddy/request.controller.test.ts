import { expect } from "chai";
import { Done } from "mocha";
import PGMock2, { getPool } from "pgmock2";
import { Pool } from "pg";
import RequestController from "../../../src/buddy/controllers/request.controller";
import { buildUpdateByIDQuery } from "../../../src/common/tools/queryBuilder";
import ReqModel from "../../../src/buddy/models/request.model";
import HttpError from "../../../src/common/models/error.model";

describe("Request Controller", () => {
  let pgmock: PGMock2;
  beforeEach(() => {
    pgmock = new PGMock2();
    pgmock.dropAll();
  });

  it("should be able to get all request", (done: Done) => {
    const rc: RequestController = new RequestController();
    const pool: Pool = getPool(pgmock);

    const request1: ReqModel = {
      rq_id: 1,
      request_date: "",
      is_fulfilled: false,
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

    pgmock.add("SELECT * FROM request;", [], {
      rowCount: 3,
      rows: [request1, request2, request3],
    });

    rc.getAllRequests(pool).then(
      (requests: ReqModel[]) => {
        expect(requests).to.have.length(3);
        expect(requests[0]).to.have.property("rq_id", 1);
        expect(requests[1]).to.have.property("rq_id", 2);
        expect(requests[2]).to.have.property("rq_id", 3);
        done();
      },
      (err) => {
        done(err.message);
      }
    );
  });

  it("should be able to get request by ID", (done: Done) => {
    const rc: RequestController = new RequestController();
    const pool: Pool = getPool(pgmock);

    const request: ReqModel = {
      rq_id: 1,
      request_date: "",
      is_fulfilled: false,
      request_meeting_point: "",
      is_urgent: false,
      request_destination: "",
    };

    pgmock.add("SELECT * FROM request WHERE rq_id = $1;", ["number"], {
      rowCount: 1,
      rows: [request],
    });

    rc.getRequestByID(pool, 1).then(
      (request: ReqModel) => {
        expect(request).to.have.property("rq_id", 1);
        done();
      },
      (err) => {
        done(err.message);
      }
    );
  });

  it("should be able to create a request", (done: Done) => {
    const rc: RequestController = new RequestController();
    const pool: Pool = getPool(pgmock);

    const request: ReqModel = {
      rq_id: 1,
      request_date: "",
      is_fulfilled: false,
      request_meeting_point: "",
      is_urgent: true,
      request_destination: "",
    };

    const query =
      "INSERT INTO request " +
      "(request_date, is_fulfilled, request_meeting_point, is_urgent, request_destination) " +
      "VALUES ($1, $2, $3, $4, $5);";

    pgmock.add(query, ["string", "boolean", "string", "boolean", "string"], {
      rowCount: 1,
    });

    rc.createRequest(pool, request).then(
      (success: boolean) => {
        expect(success).to.be.true;
        done();
      },
      (err) => {
        done(err.message);
      }
    );
  });

  it("should be able to edit an existing request", (done: Done) => {
    const rc: RequestController = new RequestController();
    const pool: Pool = getPool(pgmock);

    const request: ReqModel = {
      rq_id: 1,
      request_date: "",
      is_fulfilled: false,
      request_meeting_point: "",
      is_urgent: false,
      request_destination: "",
    };

    const query = buildUpdateByIDQuery<ReqModel>(
      "request",
      "rq_id",
      1,
      request
    );

    pgmock.add(query, [], {
      rowCount: 1,
    });

    rc.updateRequestByID(pool, 1, request).then((success: boolean) => {
      expect(success).to.be.true;
      done();
    });
  });

  it("should be able to delete a request", (done: Done) => {
    const rc: RequestController = new RequestController();
    const pool: Pool = getPool(pgmock);

    pgmock.add("DELETE FROM request WHERE rq_id = $1;", ["number"], {
      rowCount: 1,
    });

    rc.deleteRequestByID(pool, 1).then(
      (success: boolean) => {
        expect(success).to.be.true;
        done();
      },
      (err) => {
        done(err.message);
      }
    );
  });

  it("should give a 404 error if request not found", (done: Done) => {
    const rc: RequestController = new RequestController();
    const pool: Pool = getPool(pgmock);

    pgmock.add("SELECT * FROM request WHERE rq_id = $1;", ["number"], {
      rowCount: 0,
      rows: [],
    });

    rc.getRequestByID(pool, 1).then(
      () => {
        done("Unexpected - should be failing test.");
      },
      (err) => {
        expect(err).to.be.instanceOf(HttpError);
        expect(err.status).to.be.eql(404);
        expect(err.message).to.be.eql("No request found with id = 1");
        done();
      }
    );
  });
});
