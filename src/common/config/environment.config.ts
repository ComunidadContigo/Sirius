const env = process.env.NODE_ENV || "development";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require("dotenv");
dotenv.config();

export interface Environment {
  dbconf: DBConfig;
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
  url: string;
  port: number;
}

// used for local development
const devConf: Environment = {
  dbconf: {
    user: process.env.DEV_DBUSER || "",
    password: process.env.DEV_DBPASS || "",
    url: process.env.DEV_DBURL || "",
    port: Number(process.env.DEV_DBPORT),
  },

  hostconf: {
    host: process.env.DEV_HOST || "",
    port: Number(process.env.DEV_PORT || ""),
  },

  secret_key: process.env.DEV_SECRETKEY || "fake_secret_key",
};

const stagingConf: Environment = {
  dbconf: {
    user: process.env.STAGING_DBUSER || "",
    password: process.env.STAGING_DBPASS || "",
    url: process.env.STAGING_DBURL || "",
    port: Number(process.env.STAGING_DBPORT),
  },

  hostconf: {
    host: process.env.STAGING_HOST || "",
    port: Number(process.env.STAGING_PORT || ""),
  },

  secret_key: process.env.STAGING_SECRETKEY || "fake_secret_key",
};

const testConf: Environment = {
  dbconf: {
    user: process.env.TEST_DBUSER || "",
    password: process.env.TEST_DBPASS || "",
    url: process.env.TEST_DBURL || "",
    port: Number(process.env.TEST_DBPORT),
  },

  hostconf: {
    host: process.env.TEST_HOST || "",
    port: Number(process.env.TEST_PORT || ""),
  },

  secret_key: process.env.TEST_SECRETKEY || "fake_secret_key",
};

const prodConf: Environment = {
  dbconf: {
    user: process.env.PROD_DBUSER || "",
    password: process.env.PROD_DBPASS || "",
    url: process.env.PROD_DBURL || "",
    port: Number(process.env.PROD_DBPORT),
  },

  hostconf: {
    host: process.env.PROD_HOST || "",
    port: Number(process.env.PROD_PORT || ""),
  },

  secret_key: process.env.PROD_SECRETKEY || "fake_secret_key",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const e: any = {
  development: devConf,
  staging: stagingConf,
  test: testConf,
  prod: prodConf,
};

export default e[env];
