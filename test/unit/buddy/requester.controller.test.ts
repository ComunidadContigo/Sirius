import { expect } from "chai";
import { Done } from "mocha";
import PGMock2, { getPool } from "pgmock2";
import { Pool } from "pg";
import RequesterController from "../../../src/buddy/controllers/requester.controller";
import Requester from "../../../src/buddy/models/requester.model";
import { buildUpdateByIDQuery } from "../../../src/common/tools/queryBuilder";
import HttpError from "../../../src/common/models/error.model";

describe("Requester Controller", () => {
  let pgmock: PGMock2;
  beforeEach(() => {
    pgmock = new PGMock2();
    pgmock.dropAll();
  });

  it("should be able to get all requester", (done: Done) => {
    const bc: RequesterController = new RequesterController();
    const pool: Pool = getPool(pgmock);

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

    bc.getAllRequesters(pool).then(
      (buddies: Requester[]) => {
        expect(buddies).to.have.length(3);
        expect(buddies[0]).to.have.property("r_id", 1);
        expect(buddies[1]).to.have.property("r_id", 2);
        expect(buddies[2]).to.have.property("r_id", 3);
        done();
      },
      (err) => {
        done(err.message);
      }
    );
  });

  it("should be able to get requester by ID", (done: Done) => {
    const bc: RequesterController = new RequesterController();
    const pool: Pool = getPool(pgmock);

    const requester: Requester = {
      r_id: 1,
      requester_rating_avg: 0,
      u_id: 0,
    };

    pgmock.add("SELECT * FROM requester WHERE r_id = $1;", ["number"], {
      rowCount: 1,
      rows: [requester],
    });

    bc.getRequesterByID(pool, 1).then(
      (requester: Requester) => {
        expect(requester).to.have.property("r_id", 1);
        done();
      },
      (err) => {
        done(err.message);
      }
    );
  });

  it("should be able to create a requester", (done: Done) => {
    const bc: RequesterController = new RequesterController();
    const pool: Pool = getPool(pgmock);

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

    bc.createRequester(pool, requester).then(
      (success: boolean) => {
        expect(success).to.be.true;
        done();
      },
      (err) => {
        done(err.message);
      }
    );
  });

  it("should be able to edit an existing requester", (done: Done) => {
    const bc: RequesterController = new RequesterController();
    const pool: Pool = getPool(pgmock);

    const requester: Requester = {
      requester_rating_avg: 0,
      u_id: 0,
    };

    const query = buildUpdateByIDQuery<Requester>(
      "requester",
      "r_id",
      1,
      requester
    );

    pgmock.add(query, [], {
      rowCount: 1,
    });

    bc.updateRequesterByID(pool, 1, requester).then((success: boolean) => {
      expect(success).to.be.true;
      done();
    });
  });

  it("should be able to delete a requester", (done: Done) => {
    const bc: RequesterController = new RequesterController();
    const pool: Pool = getPool(pgmock);

    pgmock.add("DELETE FROM requester WHERE r_id = $1;", ["number"], {
      rowCount: 1,
    });

    bc.deleteRequesterByID(pool, 1).then(
      (success: boolean) => {
        expect(success).to.be.true;
        done();
      },
      (err) => {
        done(err.message);
      }
    );
  });

  it("should give a 404 error if requester not found", (done: Done) => {
    const bc: RequesterController = new RequesterController();
    const pool: Pool = getPool(pgmock);

    pgmock.add("SELECT * FROM requester WHERE r_id = $1;", ["number"], {
      rowCount: 0,
      rows: [],
    });

    bc.getRequesterByID(pool, 1).then(
      () => {
        done("Unexpected - should be failing test.");
      },
      (err) => {
        expect(err).to.be.instanceOf(HttpError);
        expect(err.status).to.be.eql(404);
        expect(err.message).to.be.eql("No requester found with id = 1");
        done();
      }
    );
  });

  it("should be able to get requester by user ID", (done: Done) => {
    const bc: RequesterController = new RequesterController();
    const pool: Pool = getPool(pgmock);

    const requester: Requester = {
      r_id: 1,
      requester_rating_avg: 0,
      u_id: 1,
    };

    pgmock.add("SELECT * FROM requester WHERE u_id = $1;", ["number"], {
      rowCount: 1,
      rows: [requester],
    });

    bc.getRequesterByUID(pool, 1).then(
      (requester: Requester) => {
        expect(requester).to.have.property("u_id", 1);
        done();
      },
      (err) => {
        done(err.message);
      }
    );
  });
});
