import express from "express";
import cors from "cors";

export default function App() {
    const app: express.Application = express();
    const port: string = process.env.PORT || "4000";

    // add middleware
    app.use(cors());
    app.use(express.json());

    app.get('/', (req: express.Request, res: express.Response) => {
        res.status(200).send("Hello World!");
    });

    app.listen(+port, () => {
        console.log("App is listening on port " + port + " running in environment " + process.env.NODE_ENV);
    });
};

App();