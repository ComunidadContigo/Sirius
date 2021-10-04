import { Done } from "mocha";
import { Pool } from "pg";
import PGMock2, { getPool } from "pgmock2";
import UserServer from "../../../src/user/api";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { Application } from "express";
import User from "../../../src/user/models/user.model";
import HttpResponse from "../../../src/common/models/response.model";
import { buildUpdateByIDQuery } from "../../../src/common/tools/queryBuilder";

describe("User API connection", () => {
  const pgmock: PGMock2 = new PGMock2();
  const dbPool: Pool = getPool(pgmock);
  chai.use(chaiHttp);
  const app: Application = UserServer(dbPool);

  it("should successfully connect to API | GET /user", (done: Done) => {
    const user1: User = {
      id: 1,
      email: "",
      password: "",
      user_name: "",
      phone_number: "",
      user_rating: 0,
    };

    const user2: User = {
      id: 2,
      email: "",
      password: "",
      user_name: "",
      phone_number: "",
      user_rating: 0,
    };

    const user3: User = {
      id: 3,
      email: "",
      password: "",
      user_name: "",
      phone_number: "",
      user_rating: 0,
    };

    pgmock.add('SELECT * FROM "user";', [], {
      rowCount: 3,
      rows: [user1, user2, user3],
    });

    chai
      .request(app)
      .get("/user")
      .end((err, res) => {
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
      id: 1,
      email: "",
      password: "",
      user_name: "",
      phone_number: "",
      user_rating: 0,
    };

    pgmock.add('SELECT * FROM "user" WHERE id = $1;', ["number"], {
      rowCount: 1,
      rows: [user],
    });

    chai
      .request(app)
      .get("/user/1")
      .end((err, res) => {
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
      id: 1,
      email: "test@test.com",
      password: "test",
      user_name: "test",
      phone_number: "test",
      user_rating: 0,
    };

    const query =
      'INSERT INTO "user" (email, password, user_name, phone_number, user_rating) VALUES' +
      "('$1', '$2', '$3', '$4', '$5');";

    pgmock.add(query, ["string", "string", "string", "string", "number"], {
      rowCount: 1,
    });

    chai
      .request(app)
      .post("/user/")
      .send(user)
      .end((err, res) => {
        // const resBody: HttpResponse<User> = res.body; //type check
        // expect(resBody.success).to.be.true;
        // expect(resBody.returnCode).to.be.eql(201);
        // expect(resBody.rowCount).to.be.undefined; // this route does not return rowCount
        // expect(resBody.data).to.be.undefined; // this route does not return data
        console.log(res.body);
        done();
      });
  });

  it("should successfully connect to API | PUT /user/:id", (done: Done) => {
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

    chai
      .request(app)
      .put("/user/1")
      .send(user)
      .end((err, res) => {
        const resBody: HttpResponse<User> = res.body; //type check
        expect(resBody.success).to.be.true;
        expect(resBody.returnCode).to.be.eql(202);
        expect(resBody.rowCount).to.be.undefined; // this route does not return rowCount
        expect(resBody.data).to.be.undefined; // this route does not return data
        done();
      });
  });

  it("should successfully connect to API | DELETE /user/:id", (done: Done) => {
    pgmock.add('DELETE FROM "user" WHERE id = $1;', ["number"], {
      rowCount: 1,
    });

    chai
      .request(app)
      .delete("/user/1")
      .end((err, res) => {
        const resBody: HttpResponse<User> = res.body; //type check
        expect(resBody.success).to.be.true;
        expect(resBody.returnCode).to.be.eql(203);
        expect(resBody.rowCount).to.be.undefined; // this route does not return rowCount
        expect(resBody.data).to.be.undefined; // this route does not return data
        done();
      });
  });
});
