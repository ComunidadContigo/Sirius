import RealTimeServer from "./api";

const port: string = process.env.PORT || "4000";
const host: string = process.env.HOST || "localhost";

RealTimeServer().listen(+port, () => {
    // TODO change this to an actual logger
    console.log(`App is listening on http://${host}:${port} on environment ${process.env.NODE_ENV}`);
});