import { Pool, QueryResult } from "pg";
import bcrypt from "bcrypt";
import { buildUserUpdateByIDQuery } from "../../common/tools/queryBuilder";
import environment from "../../common/config/environment.config";
import User from "../models/user.model";
import HttpError from "../../common/models/error.model";
import RequesterController from "../../buddy/controllers/requester.controller";
import BuddyController from "../../buddy/controllers/buddy.controller";
import Requester from "../../buddy/models/requester.model";
import Buddy from "../../buddy/models/buddy.model";
import { AWSError, S3, Request } from "aws-sdk";
import fs from "fs";
import internal from "stream";

export default class UserController {
  private saltRounds = 10;

  public async getUserByEmail(db: Pool, email: string): Promise<User> {
    const query = 'SELECT * FROM "user" WHERE email = $1;';
    const queryResult: QueryResult<User> = await db.query(query, [email]);
    if (queryResult.rowCount == 0)
      throw new HttpError(404, `No user found with email = ${email}`);
    return queryResult.rows[0];
  }

  public async getAllUsers(db: Pool, limit?: number): Promise<User[]> {
    let query: string;
    if (limit && limit > 0) {
      query = `SELECT * FROM "user" LIMIT ${limit};`;
    } else {
      query = 'SELECT * FROM "user";';
    }
    const queryResult: QueryResult<User> = await db.query(query);
    if (queryResult.rowCount == 0)
      throw new HttpError(404, `Database has no users!`);
    return queryResult.rows;
  }

  public async getUserByID(db: Pool, id: number): Promise<User> {
    const query = 'SELECT * FROM "user" WHERE u_id = $1;';
    const queryResult: QueryResult<User> = await db.query(query, [id]);
    if (queryResult.rowCount == 0)
      throw new HttpError(404, `No user found with id = ${id}`);
    return queryResult.rows[0];
  }

  public async createUser(db: Pool, user: User): Promise<boolean> {
    // try to find if a user already exist

    let foundEmail = true;
    try {
      await this.getUserByEmail(db, user.email);
    } catch (e) {
      if (e instanceof HttpError && e.status == 404) {
        foundEmail = false;
      } else {
        throw e;
      }
    }
    if (foundEmail) {
      throw new HttpError(403, "Email already taken!");
    }

    // no matches found, proceed to create account

    const hashedPassword: string = await bcrypt.hash(
      user.password,
      this.saltRounds
    );
    const query =
      'INSERT INTO "user" ' +
      "(email, password, first_name, last_name, birth_date, gender, phone_number) " +
      "VALUES ($1, $2, $3, $4, $5, $6, $7);";
    const queryResult: QueryResult = await db.query(query, [
      user.email,
      hashedPassword,
      user.first_name,
      user.last_name,
      new Date(user.birth_date).toISOString(),
      user.gender,
      user.phone_number,
    ]);
    //buddify
    this.buddify(db, user);

    return queryResult.rowCount == 1;
  }

  public async updateUserByID(
    db: Pool,
    id: number,
    user: User
  ): Promise<boolean> {
    const query = buildUserUpdateByIDQuery<User>("user", id, user);
    const queryResult: QueryResult = await db.query(query);
    if (queryResult.rowCount == 0)
      throw new HttpError(404, `No user found with id = ${id}`);
    return queryResult.rowCount === 1;
  }

  public async deleteUserByID(db: Pool, id: number): Promise<boolean> {
    const query = `DELETE FROM "user" WHERE u_id = $1;`;
    const queryResult: QueryResult = await db.query(query, [id]);
    if (queryResult.rowCount == 0)
      throw new HttpError(404, `No user found with id = ${id}`);
    return queryResult.rowCount === 1;
  }

  public async vettingProcessComplete(db: Pool, id: number): Promise<boolean> {
    const query = "UPDATE vetting SET is_vetted = true WHERE u_id = $1;";
    const queryResult: QueryResult = await db.query(query, [id]);
    if (queryResult.rowCount == 0)
      throw new HttpError(404, `No user found with id = ${id}`);
    const rc: RequesterController = new RequesterController();
    const bc: BuddyController = new BuddyController();

    const requester: Requester = {
      requester_rating_avg: 0,
      u_id: id,
    };
    const createdRequester = await rc.createRequester(db, requester);

    const queryBuddy = "SELECT buddify FROM vetting WHERE u_id = $1;";
    const queryResultBuddy: QueryResult<Boolean> = await db.query(queryBuddy, [
      id,
    ]);
    if (queryResultBuddy.rowCount == 1 && queryResult.rows[0]) {
      const buddy: Buddy = {
        buddy_rating_avg: 0,
        u_id: id,
        is_active: true,
      };
      const createdBuddy = await bc.createBuddy(db, buddy);
      return createdRequester && createdBuddy;
    } else {
      return createdRequester;
    }
  }

  public async getBuddyID(db: Pool, id: number): Promise<User> {
    const query =
      'SELECT email, phone_number, birth_date, first_name, last_name, gender, u_id FROM "user" NATURAL JOIN buddy WHERE b_id = $1;';
    const queryResult: QueryResult<User> = await db.query(query, [id]);
    if (queryResult.rowCount == 0)
      throw new HttpError(404, `No user found with id = ${id}`);
    return queryResult.rows[0];
  }

  public async getRequesterID(db: Pool, id: number): Promise<User> {
    const query =
      'SELECT email, phone_number, birth_date, first_name, last_name, gender, u_id FROM "user" NATURAL JOIN requester WHERE r_id = $1;';
    const queryResult: QueryResult<User> = await db.query(query, [id]);
    if (queryResult.rowCount == 0)
      throw new HttpError(404, `No requester found with id = ${id}`);
    return queryResult.rows[0];
  }

  public async buddify(db: Pool, user: User): Promise<boolean> {
    // try to find if a user already exist
    const temp = this.getUserByEmail(db, user.email);
    const tempId = (await temp).u_id;
    const query =
      "INSERT INTO vetting " +
      "(u_id, buddify, is_vetted) " +
      "VALUES ($1, $2, $3);";
    const queryResult: QueryResult = await db.query(query, [
      tempId,
      user.buddify || true,
      user.is_vetted || false,
    ]);
    return queryResult.rowCount == 1;
  }

  public async isVetted(db: Pool, id: number): Promise<boolean> {
    const query = "SELECT is_vetted FROM vetting WHERE u_id = $1;";
    const queryResult: QueryResult = await db.query(query, [id]);
    if (queryResult.rowCount == 0)
      throw new HttpError(404, `No user found with id = ${id}`);
    return queryResult.rows[0];
  }

  public async uploadPicture(
    db: Pool,
    id: number,
    file: any
  ): Promise<boolean> {
    const bucketName = environment.bucket_name;
    const region = environment.bucket_region;
    const accessKeyId = environment.bucket_access_key;
    const secretAccessKey = environment.bucket_secret_key;

    const s3 = new S3({
      region,
      accessKeyId,
      secretAccessKey,
    });

    const fileStream = fs.createReadStream(file.path);

    const uploadParameters = {
      Bucket: bucketName,
      Body: fileStream,
      Key: file.filename,
    };
    //check if user exists.
    this.getUserByID(db, id);

    const query = 'UPDATE "user" SET picture = $1 WHERE u_id = $2;';
    const queryResult: QueryResult = await db.query(query, [file.filename, id]);
    s3.upload(uploadParameters).promise();
    return queryResult.rowCount == 1;
  }

  public async getUserPicture(
    db: Pool,
    id: number
  ): Promise<Request<S3.GetObjectOutput, AWSError>> {
    const bucketName = environment.bucket_name;
    const region = environment.bucket_region;
    const accessKeyId = environment.bucket_access_key;
    const secretAccessKey = environment.bucket_secret_key;

    const s3 = new S3({
      region,
      accessKeyId,
      secretAccessKey,
    });

    //Check if user has a picture

    const user = await this.getUserByID(db, id);

    if (user.picture === undefined || user.picture === null) {
      const downloadParameters = {
        Key: "a90ac38defefa8d2741ab552172affd9",
        Bucket: bucketName,
      };

      return s3.getObject(downloadParameters);
    } else {
      const downloadParameters = {
        Key: user.picture,
        Bucket: bucketName,
      };

      return s3.getObject(downloadParameters);
    }
  }

  public async getPicture(
    key: string
  ): Promise<Request<S3.GetObjectOutput, AWSError>> {
    const bucketName = environment.bucket_name;
    const region = environment.bucket_region;
    const accessKeyId = environment.bucket_access_key;
    const secretAccessKey = environment.bucket_secret_key;

    const s3 = new S3({
      region,
      accessKeyId,
      secretAccessKey,
    });

    const downloadParameters = {
      Key: key,
      Bucket: bucketName,
    };

    return s3.getObject(downloadParameters);
  }
}
