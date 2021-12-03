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
import {
  RefreshToken,
  RefreshTokenPayload,
} from "../../../src/auth/models/auth.model";
import jwt from "jsonwebtoken";
import environment from "../../../src/common/config/environment.config";

describe("Auth API Connection", () => {
  const pgmock: PGMock2 = new PGMock2();
  const dbPool: Pool = getPool(pgmock);
  chai.use(chaiHttp);
  const app: Application = AuthServer(dbPool);
  const accessToken = jwt.sign(
    { message: "Verified!" },
    environment.secret_key_access
  );

  it("should successfully connect to API | POST /login", (done: Done) => {
    const person: User = {
      u_id: 1,
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
    pgmock.add("SELECT * FROM refreshtoken WHERE u_id = $1", ["number"], {
      rowCount: 0,
    });
    pgmock.add(
      "INSERT INTO refreshtoken (u_id, token) VALUES ($1, $2)",
      ["number", "string"],
      {
        rowCount: 1,
      }
    );
    chai
      .request(app)
      .post("/login")
      .send({ email: "test@test.test", password: "test" })
      .end((err, res) => {
        if (err) done(err);
        const resBody: HttpResponse<RefreshToken> = res.body;
        const data = jwt.verify(
          resBody.data!.token,
          environment.secret_key_refresh
        ) as RefreshTokenPayload;
        expect(data.u_id).to.eql(person.u_id);
        expect(data.email).to.eql(person.email);
        expect(data.first_name).to.eql(person.first_name);
        expect(data.last_name).to.eql(person.last_name);
        done();
      });
  });

  it("should successfully connect to API | POST /login (token already in DB)", (done: Done) => {
    const person: User = {
      u_id: 1,
      email: "test@test.test",
      password: bcrypt.hashSync("test", 10),
      phone_number: "4206666969",
      first_name: "Clifford",
      gender: "Male",
      last_name: "Perro Grande",
      birth_date: "1/1/1970",
    };
    const payload: RefreshTokenPayload = {
      u_id: person.u_id!,
      email: person.email,
      first_name: person.first_name,
      last_name: person.last_name,
    };
    const token = jwt.sign(payload, environment.secret_key_refresh, {
      expiresIn: "1y",
    });

    const refreshToken: RefreshToken = {
      u_id: 1,
      token: token,
    };

    pgmock.add('SELECT * FROM "user" WHERE email = $1;', ["string"], {
      rowCount: 1,
      rows: [person],
    });
    pgmock.add("SELECT * FROM refreshtoken WHERE u_id = $1", ["number"], {
      rowCount: 1,
      rows: [refreshToken],
    });
    chai
      .request(app)
      .post("/login")
      .send({ email: "test@test.test", password: "test" })
      .end((err, res) => {
        if (err) done(err);
        const resBody: HttpResponse<RefreshToken> = res.body;
        const data = jwt.verify(
          resBody.data!.token,
          environment.secret_key_refresh
        ) as RefreshTokenPayload;
        expect(data.u_id).to.eql(person.u_id);
        expect(data.email).to.eql(person.email);
        expect(data.first_name).to.eql(person.first_name);
        expect(data.last_name).to.eql(person.last_name);
        done();
      });
  });

  it("should successfully connect to API | PUT /expo/:id", (done: Done) => {
    pgmock.add(
      "UPDATE refreshtoken SET expo_push_token = $1 WHERE u_id = $2",
      ["string", "number"],
      {
        rowCount: 1,
      }
    );

    chai
      .request(app)
      .put("/expo/1")
      .send({ token: "ExpoPushToken[asdfasdf]" })
      .set({ Authorization: `Bearer ${accessToken}` })
      .end((err, res) => {
        if (err) done(err);
        const resBody: HttpResponse = res.body;
        expect(resBody.success).to.be.true;
        done();
      });
  });
});
