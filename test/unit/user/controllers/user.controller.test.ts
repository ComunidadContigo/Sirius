import { expect } from "chai";
import { Done } from "mocha";
import PGMock2, { getPool } from "pgmock2";
import { Pool } from "pg";
import UserController from "../../../../src/user/controllers/user.controller";
import User from "../../../../src/user/models/user.model";
import { buildUpdateByIDQuery } from "../../../../src/common/tools/queryBuilder";

describe("User Controller", () => {
  let pgmock: PGMock2;
  beforeEach(() => {
    pgmock = new PGMock2();
  });

  it("should be able to get all users", (done: Done) => {
    const uc: UserController = new UserController();
    const pool: Pool = getPool(pgmock);

    const user1: User = {
      id: 1,
    };

    const user2: User = {
      id: 2,
    };

    const user3: User = {
      id: 3,
    };

    pgmock.add('SELECT * FROM "user";', ["number"], {
      rowCount: 3,
      rows: [user1, user2, user3],
    });

    uc.getAllUsers(pool).then((users: User[]) => {
      expect(users).to.have.length(3);
      expect(users[0]).to.have.property("id", 1);
      expect(users[1]).to.have.property("id", 2);
      expect(users[2]).to.have.property("id", 3);
      done();
    });
  });

  it("should be able to get user by ID", (done: Done) => {
    const uc: UserController = new UserController();
    const pool: Pool = getPool(pgmock);

    const user: User = {
      id: 1,
    };

    pgmock.add('SELECT * FROM "user" WHERE id = 1;', ["number"], {
      rowCount: 1,
      rows: [user],
    });

    uc.getUserByID(pool, 1).then((user: User) => {
      expect(user).to.have.property("id", 1);
      done();
    });
  });

  it("should be able to create a user", (done: Done) => {
    const uc: UserController = new UserController();
    const pool: Pool = getPool(pgmock);

    const user: User = {
      id: 1,
      email: "test@test.com",
      password: "test",
      user_name: "test",
      phone_number: "test",
      user_rating: 0,
    };

    const query = `INSERT INTO "user" 
      (email, password, user_name, phone_number, user_rating) VALUES 
      ('${user.email || ""}',
      '${user.password || ""}', 
      '${user.user_name || ""}', 
      '${user.phone_number || ""}', 
      '${user.user_rating || 0}')`;

    pgmock.add(query, ["number"], {
      rowCount: 1,
    });

    uc.createUser(pool, user).then((success: boolean) => {
      expect(success).to.be.true;
      done();
    });
  });

  it("should be able to edit an existing user", (done: Done) => {
    const uc: UserController = new UserController();
    const pool: Pool = getPool(pgmock);

    const user: User = {
      id: 1,
      email: "test@test.com",
      password: "test",
      user_name: "test",
      phone_number: "test",
      user_rating: 0,
    };

    const query = buildUpdateByIDQuery<User>("user", 1, user);

    pgmock.add(query, ["number"], {
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

    pgmock.add('DELETE FROM "user" WHERE id = 1;', ["number"], {
      rowCount: 1,
    });

    uc.deleteUserByID(pool, 1).then((success: boolean) => {
      expect(success).to.be.true;
      done();
    });
  });
});
