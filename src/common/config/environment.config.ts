/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
require("dotenv").config();

export interface Environment {
  dbconfig: DBConfig;
  hostconf: HostConfig;
  secret_key_refresh: string;
  secret_key_access: string;
  bucket_name: string;
  bucket_region: string;
  bucket_access_key: string;
  bucket_secret_key: string;
}

export interface HostConfig {
  host: string;
  port: number;
}

export interface DBConfig {
  user: string;
  password: string;
  host: string;
  port: number;
  database: string;
  ssl: any;
}

const environment: Environment = {
  dbconfig: {
    user: process.env.DBUSER!,
    password: process.env.DBPASS!,
    host: process.env.DBURL!,
    port: Number(process.env.DBPORT!),
    database: process.env.DBNAME!,
    ssl:
      process.env.NODE_ENV === "testing"
        ? null
        : {
            rejectUnauthorized: false,
          },
    // {
    //   rejectUnauthorized: false,
    // },
  },

  hostconf: {
    host: process.env.HOST!,
    port: Number(process.env.PORT!),
  },

  secret_key_refresh: process.env.SECRETKEY_REFRESH!,
  secret_key_access: process.env.SECRETKEY_ACCESS!,
  bucket_name: process.env.AWS_BUCKET_NAME!,
  bucket_region: process.env.AWS_BUCKET_REGION!,
  bucket_access_key: process.env.AWS_ACCESS_KEY!,
  bucket_secret_key: process.env.AWS_SECRET_KEY!,
};

export default environment;
