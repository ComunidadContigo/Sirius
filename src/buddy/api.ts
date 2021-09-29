import express from "express";
import cors from "cors";
import api_router from "./routes/router";
import environmentConfig from "../../src/common/config/environment.config";
import { Pool } from "pg";

export default function BuddyServer(): express.Application {
  const app: express.Application = express();

  // set up DB connection
  // set up DB connection
  const pool: Pool = new Pool(environmentConfig.dbconf);
  app.set("dbPool", pool);

  // add middleware
  app.use(cors()); // adds CORS policy
  app.use(express.json()); // only parses request bodies that send JSON
  app.use(api_router()); // adds custom routes

  app.get("/", (req: express.Request, res: express.Response) => {
    res.status(200).send("Server running!");
  });

  return app;
}
