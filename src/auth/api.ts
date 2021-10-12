import express from "express";
import cors from "cors";
import api_router from "./routes/router";
import { Pool } from "pg";

export default function AuthServer(dbPool: Pool): express.Application {
  const app: express.Application = express();

  // set up DB connection
  app.set("dbPool", dbPool);

  // add middleware
  app.use(cors()); // adds CORS policy
  app.use(express.json()); // only parses request bodies that send JSON
  app.use(api_router()); // adds custom routes

  app.get("/", (req: express.Request, res: express.Response) => {
    res.status(200).send("Server running!");
  });

  return app;
}
