/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
require("dotenv").config();

export interface Environment {
  dbconfig: DBConfig;
  hostconf: HostConfig;
  secret_key: string;
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
}

const environment: Environment = {
  dbconfig: {
    user: process.env.DBUSER!,
    password: process.env.DBPASS!,
    host: process.env.DBURL!,
    port: Number(process.env.DBPORT!),
    database: process.env.DBNAME!,
  },

  hostconf: {
    host: process.env.HOST!,
    port: Number(process.env.PORT!),
  },

  secret_key: process.env.SECRETKEY || "fake_secret_key",
};

export default environment;
