const env = process.env.NODE_ENV || "local";

if (env === "development") {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const dotenv = require("dotenv");
  dotenv.config();
}

export interface Environment {
  dbconf: DBConfig;
  hostconf: HostConfig;
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
    user: process.env.LOCAL_DBUSER || "",
    password: process.env.LOCAL_DBPASS || "",
    url: process.env.LOCAL_DBURL || "",
    port: Number(process.env.LOCAL_DBPORT),
  },

  hostconf: {
    host: process.env.LOCAL_HOST || "",
    port: Number(process.env.LOCAL_PORT || ""),
  },
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
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const e: any = {
  dev: devConf,
  staging: stagingConf,
  test: testConf,
  prod: prodConf,
};

export default e[env];
