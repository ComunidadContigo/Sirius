import { Done } from "mocha";
import PGMock2, { getPool } from "pgmock2";
import User from "../../../src/user/models/user.model";
import bcrypt from "bcrypt";
import { Pool } from "pg";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import HttpResponse from "../../../src/common/models/response.model";
import { Application } from "express";
import AuthServer from "../../../src/auth/api";

describe("Auth API Connection", () => {
  const pgmock: PGMock2 = new PGMock2();
  const dbPool: Pool = getPool(pgmock);
  chai.use(chaiHttp);
  const app: Application = AuthServer(dbPool);
  it("should successfully connect to API | POST /login", (done: Done) => {
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
    chai
      .request(app)
      .post("/auth/login")
      .send({ email: "test@test.test", password: "test" })
      .end((err, res) => {
        const resBody: HttpResponse<User> = res.body;
        expect(resBody.success).to.be.equal(true);
        expect(resBody.data).to.be.eql(person);
        expect(resBody.returnCode).to.be.equal(201);
        expect(resBody.messages[0]).to.be.equal("User Logged in!");
        expect(err).to.be.null;
        done();
      });
  });
});
