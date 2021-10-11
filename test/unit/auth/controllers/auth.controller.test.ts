import { Done } from "mocha";
import PGMock2, { getPool } from "pgmock2";
import User from "../../../../src/user/models/user.model";
import bcrypt from "bcrypt";
import { Pool } from "pg";
import AuthController from "../../../../src/auth/controllers/auth.controller";
import { expect } from "chai";

describe("Auth Controller", () => {
  let pgmock: PGMock2;
  beforeEach(() => {
    pgmock = new PGMock2();
    pgmock.dropAll();
  });

  it("should authenticate user credentials", (done: Done) => {
    const dbPool: Pool = getPool(pgmock);
    const ac: AuthController = new AuthController();
    const person: User = {
      email: "test@test.test",
      password: bcrypt.hashSync("test", 10),
      phone_number: "4206666969",
      first_name: "Clifford",
      gender: "Male",
      last_name: "Perro Grande",
      birth_date: "1/1/1970",
    };
    pgmock.add('SELECT * FROM "user" WHERE email = $1;', ["string"], {
      rowCount: 1,
      rows: [person],
    });
    ac.authenticate(dbPool, "test@test.test", "test").then(
      (user: User) => {
        //behavior driven testing "I am manifesting that what I give it is true."
        expect(user).to.be.equal(person);
        done();
      },
      (err) => {
        done(err.message);
      }
    );
  });
});
