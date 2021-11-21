import { Done } from "mocha";
import { Pool } from "pg";
import PGMock2, { getPool } from "pgmock2";
import UserServer from "../../../src/user/api";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { Application } from "express";
import User from "../../../src/user/models/user.model";
import HttpResponse from "../../../src/common/models/response.model";
import { buildUserUpdateByIDQuery } from "../../../src/common/tools/queryBuilder";
import jwt from "jsonwebtoken";
import environment from "../../../src/common/config/environment.config";

describe("User API connection", () => {
  const pgmock: PGMock2 = new PGMock2();
  const dbPool: Pool = getPool(pgmock);
  chai.use(chaiHttp);
  const app: Application = UserServer(dbPool);

  const accessToken = jwt.sign(
    { message: "Verified!" },
    environment.secret_key_access
  );

  beforeEach(() => {
    pgmock.dropAll();
  });

  it("should successfully connect to API | GET /user", (done: Done) => {
    const user1: User = {
      u_id: 1,
      email: "",
      password: "",
      phone_number: "",
      birth_date: "1/1/1970",
      first_name: "",
      gender: "",
      last_name: "",
    };

    const user2: User = {
      u_id: 2,
      email: "",
      password: "",
      phone_number: "",
      birth_date: "1/1/1970",
      first_name: "",
      gender: "",
      last_name: "",
    };

    const user3: User = {
      u_id: 3,
      email: "",
      password: "",
      phone_number: "",
      birth_date: "1/1/1970",
      first_name: "",
      gender: "",
      last_name: "",
    };

    pgmock.add('SELECT * FROM "user";', [], {
      rowCount: 3,
      rows: [user1, user2, user3],
    });

    chai
      .request(app)
      .get("/")
      .set({ Authorization: `Bearer ${accessToken}` })
      .end((err, res) => {
        if (err) done(err);
        const resBody: HttpResponse<User[]> = res.body; //type check
        expect(resBody.success).to.be.true;
        expect(resBody.returnCode).to.be.eql(200);
        expect(resBody.rowCount).to.eql(3);
        expect(resBody.data).to.not.be.undefined;
        done();
      });
  });

  it("should successfully connect to API | GET /user/:id", (done: Done) => {
    const user: User = {
      u_id: 1,
      email: "",
      password: "",
      phone_number: "",
      birth_date: "1/1/1970",
      first_name: "",
      gender: "",
      last_name: "",
    };

    pgmock.add('SELECT * FROM "user" WHERE u_id = $1;', ["number"], {
      rowCount: 1,
      rows: [user],
    });

    chai
      .request(app)
      .get("/1")
      .set({ Authorization: `Bearer ${accessToken}` })
      .end((err, res) => {
        if (err) done(err);
        const resBody: HttpResponse<User> = res.body; //type check
        expect(resBody.success).to.be.true;
        expect(resBody.returnCode).to.be.eql(200);
        expect(resBody.rowCount).to.be.undefined; // get user by id does not return rowCount
        expect(resBody.data).to.not.be.undefined;
        done();
      });
  });

  it("should successfully connect to API | POST /user", (done: Done) => {
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

    chai
      .request(app)
      .post("/")
      .send(user)
      .end((err, res) => {
        const resBody: HttpResponse<User> = res.body; //type check
        expect(resBody.success).to.be.true;
        expect(resBody.returnCode).to.be.eql(201);
        expect(resBody.rowCount).to.be.undefined; // this route does not return rowCount
        expect(resBody.data).to.be.undefined; // this route does not return data
        done();
      });
  });

  it("should successfully connect to API | PUT /user/location/:id", (done: Done) => {
    const user: User = {
      u_id: 1,
      email: "test@test.com",
      password: "test",
      phone_number: "test",
      birth_date: "1/1/1970",
      first_name: "",
      gender: "",
      last_name: "",
      user_last_location: "(52.8165972, -2.1174389000000247)",
    };

    const query = buildUserUpdateByIDQuery<User>("user", 1, user);

    pgmock.add(query, ["number"], {
      rowCount: 1,
    });

    chai
      .request(app)
      .put("/location/1")
      .send(user)
      .set({ Authorization: `Bearer ${accessToken}` })
      .end((err, res) => {
        if (err) done(err);
        const resBody: HttpResponse<User> = res.body; //type check
        expect(resBody.success).to.be.true;
        expect(resBody.returnCode).to.be.eql(202);
        expect(resBody.rowCount).to.be.undefined; // this route does not return rowCount
        expect(resBody.data).to.be.undefined; // this route does not return data
        done();
      });
  });

  it("should successfully connect to API | DELETE /user/:id", (done: Done) => {
    pgmock.add('DELETE FROM "user" WHERE u_id = $1;', ["number"], {
      rowCount: 1,
    });

    chai
      .request(app)
      .delete("/1")
      .set({ Authorization: `Bearer ${accessToken}` })
      .end((err, res) => {
        if (err) done(err);
        const resBody: HttpResponse<User> = res.body; //type check
        expect(resBody.success).to.be.true;
        expect(resBody.returnCode).to.be.eql(203);
        expect(resBody.rowCount).to.be.undefined; // this route does not return rowCount
        expect(resBody.data).to.be.undefined; // this route does not return data
        done();
      });
  });

  it("should give an error | GET /user 404", (done: Done) => {
    pgmock.add('SELECT * FROM "user"', [], {
      rowCount: 0,
      rows: [],
    });

    chai
      .request(app)
      .get("/")
      .set({ Authorization: `Bearer ${accessToken}` })
      .end((err, res) => {
        if (err) done(err);
        const resBody: HttpResponse<User[]> = res.body; //type check
        expect(resBody.success).to.be.false;
        expect(resBody.returnCode).to.be.eql(404);
        expect(resBody.errors[0]).to.be.eql("Database has no users!");
        done();
      });
  });

  it("should successfully connect to API | PUT /user/vetted/:id", (done: Done) => {
    const buddify = true;
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

    pgmock.add("SELECT buddify FROM vetting WHERE u_id = $1", ["number"], {
      rowCount: 1,
      rows: [buddify],
    });

    if (buddify) {
      const queryBuddy =
        "INSERT INTO buddy " +
        "(u_id, buddy_rating_avg, is_active) " +
        "VALUES ($1, $2, $3);";

      pgmock.add(queryBuddy, ["number", "number", "boolean"], {
        rowCount: 1,
      });
    }

    chai
      .request(app)
      .put("/vetted/1")
      .set({ Authorization: `Bearer ${accessToken}` })
      .end((err, res) => {
        if (err) done(err);
        const resBody: HttpResponse = res.body; //type check
        expect(resBody.success).to.be.true;
        expect(resBody.returnCode).to.be.eql(202);
        expect(resBody.rowCount).to.be.undefined; // this route does not return rowCount
        expect(resBody.data).to.be.undefined; // this route does not return data
        done();
      });
  });
});
