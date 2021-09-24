import express from "express";
import cors from "cors";
import api_router from "./routes/router";

export default function UserServer(): express.Application {
    const app: express.Application = express();

    // add middleware
    app.use(cors()); // adds CORS policy
    app.use(express.json()); // only parses request bodies that send JSON
    app.use(api_router()) // adds custom routes

    app.get('/', (req: express.Request, res: express.Response) => {
        res.status(200).send("Server running!");
    });

    return app;
}