import { expect } from "chai";
import { Done } from "mocha";
import PGMock2, { getPool } from "pgmock2";
import { Pool } from "pg";
import BuddyController from "../../../src/buddy/controllers/buddy.controller";
import Buddy from "../../../src/buddy/models/buddy.model";
import { buildUpdateByIDQuery } from "../../../src/common/tools/queryBuilder";
import HttpError from "../../../src/common/models/error.model";

describe("Buddy Controller", () => {
  let pgmock: PGMock2;
  beforeEach(() => {
    pgmock = new PGMock2();
    pgmock.dropAll();
  });

  it("should be able to get all buddy", (done: Done) => {
    const bc: BuddyController = new BuddyController();
    const pool: Pool = getPool(pgmock);

    const buddy1: Buddy = {
      b_id: 1,
      buddy_rating_avg: 0,
      u_id: 0,
    };

    const buddy2: Buddy = {
      b_id: 2,

      buddy_rating_avg: 0,
      u_id: 0,
    };

    const buddy3: Buddy = {
      b_id: 3,

      buddy_rating_avg: 0,
      u_id: 0,
    };

    pgmock.add("SELECT * FROM buddy;", [], {
      rowCount: 3,
      rows: [buddy1, buddy2, buddy3],
    });

    bc.getAllBuddies(pool).then(
      (buddies: Buddy[]) => {
        expect(buddies).to.have.length(3);
        expect(buddies[0]).to.have.property("b_id", 1);
        expect(buddies[1]).to.have.property("b_id", 2);
        expect(buddies[2]).to.have.property("b_id", 3);
        done();
      },
      (err) => {
        done(err.message);
      }
    );
  });

  it("should be able to get buddy by ID", (done: Done) => {
    const bc: BuddyController = new BuddyController();
    const pool: Pool = getPool(pgmock);

    const buddy: Buddy = {
      b_id: 1,

      buddy_rating_avg: 0,
      u_id: 0,
    };

    pgmock.add("SELECT * FROM buddy WHERE b_id = $1;", ["number"], {
      rowCount: 1,
      rows: [buddy],
    });

    bc.getBuddyByID(pool, 1).then(
      (buddy: Buddy) => {
        expect(buddy).to.have.property("b_id", 1);
        done();
      },
      (err) => {
        done(err.message);
      }
    );
  });

  it("should be able to create a buddy", (done: Done) => {
    const bc: BuddyController = new BuddyController();
    const pool: Pool = getPool(pgmock);

    const buddy: Buddy = {
      b_id: 1,

      buddy_rating_avg: 0,
      u_id: 0,
    };

    const query =
      "INSERT INTO buddy " + "(u_id, buddy_rating_avg) " + "VALUES ($1, $2);";

    pgmock.add(query, ["number", "number"], {
      rowCount: 1,
    });

    bc.createBuddy(pool, buddy).then(
      (success: boolean) => {
        expect(success).to.be.true;
        done();
      },
      (err) => {
        done(err.message);
      }
    );
  });

  it("should be able to edit an existing buddy", (done: Done) => {
    const bc: BuddyController = new BuddyController();
    const pool: Pool = getPool(pgmock);

    const buddy: Buddy = {
      b_id: 1,

      buddy_rating_avg: 0,
      u_id: 0,
    };

    const query = buildUpdateByIDQuery<Buddy>("buddy", "b_id", 1, buddy);

    pgmock.add(query, [], {
      rowCount: 1,
    });

    bc.updateBuddyByID(pool, 1, buddy).then((success: boolean) => {
      expect(success).to.be.true;
      done();
    });
  });

  it("should be able to delete a buddy", (done: Done) => {
    const bc: BuddyController = new BuddyController();
    const pool: Pool = getPool(pgmock);

    pgmock.add("DELETE FROM buddy WHERE b_id = $1;", ["number"], {
      rowCount: 1,
    });

    bc.deleteBuddyByID(pool, 1).then(
      (success: boolean) => {
        expect(success).to.be.true;
        done();
      },
      (err) => {
        done(err.message);
      }
    );
  });

  it("should give a 404 error if buddy not found", (done: Done) => {
    const bc: BuddyController = new BuddyController();
    const pool: Pool = getPool(pgmock);

    pgmock.add("SELECT * FROM buddy WHERE b_id = $1;", ["number"], {
      rowCount: 0,
      rows: [],
    });

    bc.getBuddyByID(pool, 1).then(
      () => {
        done("Unexpected - should be failing test.");
      },
      (err) => {
        expect(err).to.be.instanceOf(HttpError);
        expect(err.status).to.be.eql(404);
        expect(err.message).to.be.eql("No buddy found with id = 1");
        done();
      }
    );
  });

  it("should be able to get buddy by user ID", (done: Done) => {
    const bc: BuddyController = new BuddyController();
    const pool: Pool = getPool(pgmock);

    const buddy: Buddy = {
      b_id: 1,
      buddy_rating_avg: 0,
      u_id: 0,
    };

    pgmock.add("SELECT * FROM buddy WHERE u_id = $1;", ["number"], {
      rowCount: 1,
      rows: [buddy],
    });

    bc.getBuddyByUID(pool, 1).then(
      (buddy: Buddy) => {
        expect(buddy).to.have.property("b_id", 1);
        done();
      },
      (err) => {
        done(err.message);
      }
    );
  });
});
