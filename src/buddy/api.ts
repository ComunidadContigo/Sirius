import express from "express";
import cors from "cors";
import api_router from "./routes/router";
import environmentConfig from "../common/config/environment.config";
import { Pool } from "pg";

export default function BuddyServer(dbPool: Pool): express.Application {
  const app: express.Application = express();

  // set up DB connection
  app.set("dbPool", dbPool);

  // add middleware
  app.use(cors()); // adds CORS policy
  app.use(express.json()); // only parses request bodies that send JSON
  app.use(api_router()); // adds custom routes

  return app;
}
