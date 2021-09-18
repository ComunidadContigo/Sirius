import BuddyServer from "./api";

const port: string = process.env.PORT || "4000";
const host: string = process.env.HOST || "localhost";

BuddyServer().listen(+port, () => {
    // TODO change this to an actual logger
    // tslint:disable-next-line: no-console
    console.log(`App is listening on http://${host}:${port} on environment ${process.env.NODE_ENV}`);
});