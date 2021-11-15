import { expect } from "chai";
import { Done } from "mocha";
import PGMock2, { getPool } from "pgmock2";
import { Pool } from "pg";
import UserController from "../../../../src/user/controllers/user.controller";
import User from "../../../../src/user/models/user.model";
import { buildUserUpdateByIDQuery } from "../../../../src/common/tools/queryBuilder";
import HttpError from "../../../../src/common/models/error.model";

describe("User Controller", () => {
  let pgmock: PGMock2;
  beforeEach(() => {
    pgmock = new PGMock2();
    pgmock.dropAll();
  });

  it("should be able to get all users", (done: Done) => {
    const uc: UserController = new UserController();
    const pool: Pool = getPool(pgmock);

    const user1: User = {
      u_id: 1,
      email: "",
      password: "",
      phone_number: "",
      birth_date: "1/1/1970",
      first_name: "",
      last_name: "",
      is_vetted: false,
      gender: "",
    };

    const user2: User = {
      u_id: 2,
      email: "",
      password: "",
      phone_number: "",
      birth_date: "1/1/1970",
      first_name: "",
      last_name: "",
      is_vetted: false,
      gender: "",
    };

    const user3: User = {
      u_id: 3,
      email: "",
      password: "",
      phone_number: "",
      birth_date: "1/1/1970",
      first_name: "",
      last_name: "",
      is_vetted: false,
      gender: "",
    };

    pgmock.add('SELECT * FROM "user";', [], {
      rowCount: 3,
      rows: [user1, user2, user3],
    });

    uc.getAllUsers(pool).then(
      (users: User[]) => {
        expect(users).to.have.length(3);
        expect(users[0]).to.have.property("u_id", 1);
        expect(users[1]).to.have.property("u_id", 2);
        expect(users[2]).to.have.property("u_id", 3);
        done();
      },
      (err) => {
        done(err.message);
      }
    );
  });

  it("should be able to get user by ID", (done: Done) => {
    const uc: UserController = new UserController();
    const pool: Pool = getPool(pgmock);

    const user: User = {
      u_id: 1,
      email: "",
      password: "",
      phone_number: "",
      birth_date: "1/1/1970",
      first_name: "",
      last_name: "",
      is_vetted: false,
      gender: "",
    };

    pgmock.add('SELECT * FROM "user" WHERE u_id = $1;', ["number"], {
      rowCount: 1,
      rows: [user],
    });

    uc.getUserByID(pool, 1).then(
      (user: User) => {
        expect(user).to.have.property("u_id", 1);
        done();
      },
      (err) => {
        done(err.message);
      }
    );
  });

  it("should be able to create a user", (done: Done) => {
    const uc: UserController = new UserController();
    const pool: Pool = getPool(pgmock);

    const user: User = {
      email: "test@test.com",
      password: "test",
      phone_number: "test",
      birth_date: "1/1/1970",
      first_name: "asdf",
      last_name: "asdf",
      is_vetted: false,
      gender: "asdf",
    };

    const query =
      'INSERT INTO "user" ' +
      "(email, password, first_name, last_name, birth_date, gender, phone_number, is_vetted) " +
      "VALUES ($1, $2, $3, $4, $5, $6, $7, $8);";

    // since createUser also queries for taken emails and usernames, we need to add those too
    pgmock.add('SELECT * FROM "user" WHERE email = $1;', ["string"], {
      rowCount: 0,
      rows: [],
    });

    pgmock.add(
      query,
      [
        "string",
        "string",
        "string",
        "string",
        "string",
        "string",
        "string",
        "boolean",
      ],
      {
        rowCount: 1,
      }
    );

    uc.createUser(pool, user).then(
      (success: boolean) => {
        expect(success).to.be.true;
        done();
      },
      (err) => {
        done(err.message);
      }
    );
  });

  it("should be able to edit an existing user", (done: Done) => {
    const uc: UserController = new UserController();
    const pool: Pool = getPool(pgmock);

    const user: User = {
      u_id: 1,
      email: "test@test.com",
      password: "test",
      phone_number: "test",
      birth_date: "1/1/1970",
      first_name: "",
      last_name: "",
      is_vetted: false,
      gender: "",
    };

    const query = buildUserUpdateByIDQuery<User>("user", 1, user);

    pgmock.add(query, [], {
      rowCount: 1,
    });

    uc.updateUserByID(pool, 1, user).then((success: boolean) => {
      expect(success).to.be.true;
      done();
    });
  });

  it("should be able to delete a user", (done: Done) => {
    const uc: UserController = new UserController();
    const pool: Pool = getPool(pgmock);

    pgmock.add('DELETE FROM "user" WHERE u_id = $1;', ["number"], {
      rowCount: 1,
    });

    uc.deleteUserByID(pool, 1).then(
      (success: boolean) => {
        expect(success).to.be.true;
        done();
      },
      (err) => {
        done(err.message);
      }
    );
  });

  it("should give a 404 error if user not found", (done: Done) => {
    const uc: UserController = new UserController();
    const pool: Pool = getPool(pgmock);

    pgmock.add('SELECT * FROM "user" WHERE u_id = $1;', ["number"], {
      rowCount: 0,
      rows: [],
    });

    uc.getUserByID(pool, 1).then(
      () => {
        done("Unexpected - should be failing test.");
      },
      (err) => {
        expect(err).to.be.instanceOf(HttpError);
        expect(err.status).to.be.eql(404);
        expect(err.message).to.be.eql("No user found with id = 1");
        done();
      }
    );
  });

  it("should successfully update a user when vetted and create buddy + requester records", (done: Done) => {
    const uc: UserController = new UserController();
    const pool: Pool = getPool(pgmock);

    pgmock.add(
      'UPDATE "user" SET is_vetted = true WHERE u_id = $1',
      ["number"],
      {
        rowCount: 1,
        rows: [],
      }
    );

    const queryRequester =
      "INSERT INTO requester " +
      "(u_id, requester_rating_avg) " +
      "VALUES ($1, $2);";

    pgmock.add(queryRequester, ["number", "number"], {
      rowCount: 1,
    });

    const queryBuddy =
      "INSERT INTO buddy " + "(u_id, buddy_rating_avg) " + "VALUES ($1, $2);";

    pgmock.add(queryBuddy, ["number", "number"], {
      rowCount: 1,
    });

    uc.vettingProcessComplete(pool, 1).then(
      (success: boolean) => {
        expect(success).to.be.true;
        done();
      },
      (err) => {
        done(err.message);
      }
    );
  });
});
