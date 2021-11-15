import environmentConfig, {
  DBConfig,
} from "../common/config/environment.config";
import { Pool } from "pg";
import UserController from "src/user/controllers/user.controller";

(async () => {
  // setup db connection

  const uc: UserController = new UserController();
  while (true) {}
})();
