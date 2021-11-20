/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
require("dotenv").config();

export interface Environment {
  dbconfig: DBConfig;
  hostconf: HostConfig;
  secret_key_refresh: string;
  secret_key_access: string;
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
};

export default environment;
