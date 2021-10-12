import { Done } from "mocha";
import PGMock2, { getPool } from "pgmock2";
import User from "../../../../src/user/models/user.model";
import bcrypt from "bcrypt";
import { Pool } from "pg";
import AuthController from "../../../../src/auth/controllers/auth.controller";
import { expect } from "chai";
import {
  RefreshToken,
  RefreshTokenPayload,
} from "../../../../src/auth/models/auth.model";
import jwt from "jsonwebtoken";
import environment from "../../../../src/common/config/environment.config";

describe("Auth Controller", () => {
  let pgmock: PGMock2;
  beforeEach(() => {
    pgmock = new PGMock2();
    pgmock.dropAll();
  });

  it("should login with correct user credentials", (done: Done) => {
    const dbPool: Pool = getPool(pgmock);
    const ac: AuthController = new AuthController();
    const person: User = {
      u_id: 1,
      email: "test@test.test",
      password: bcrypt.hashSync("test", 10),
      phone_number: "4206666969",
      first_name: "Clifford",
      gender: "Male",
      last_name: "Perro Grande",
      birth_date: "1/1/1970",
      isVetted: false,
      b_id: 0,
      r_id: 0,
    };
    pgmock.add('SELECT * FROM "user" WHERE email = $1;', ["string"], {
      rowCount: 1,
      rows: [person],
    });
    pgmock.add(
      "INSERT INTO refreshtoken (u_id, token) VALUES ($1, $2)",
      ["number", "string"],
      {
        rowCount: 1,
      }
    );
    ac.login(dbPool, "test@test.test", "test").then(
      (token: RefreshToken) => {
        const data = jwt.verify(
          token.token,
          environment.secret_key_refresh
        ) as RefreshTokenPayload;
        expect(data.u_id).to.eql(person.u_id);
        expect(data.email).to.eql(person.email);
        expect(data.first_name).to.eql(person.first_name);
        expect(data.last_name).to.eql(person.last_name);
        expect(data.isVetted).to.be.eql(person.isVetted);
        expect(data.b_id).to.be.eql(person.b_id);
        expect(data.r_id).to.be.eql(person.r_id);
        done();
      },
      (err) => {
        done(err.message);
      }
    );
  });
});
