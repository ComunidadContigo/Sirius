import UserServer from "./api";
import environmentConfig, {
  DBConfig,
} from "../common/config/environment.config";
import { Pool } from "pg";

const dbConfig: DBConfig = environmentConfig.dbconfig;
const dbPool = new Pool(dbConfig);

const port = environmentConfig.hostconf.port;
const host = environmentConfig.hostconf.host;

UserServer(dbPool).listen(+port, () => {
  // TODO change this to an actual logger
  console.log(
    `App is listening on http://${host}:${port} on environment ${process.env.NODE_ENV}`
  );
});
