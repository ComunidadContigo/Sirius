import { Router, Request, Response } from "express";
import RequestRouter from "./request.route";
import BuddyRouter from "./buddy.route";

export default function api_router(): Router {
  const router: Router = Router();
  router.get("/health", (req: Request, res: Response) => {
    res.status(200).send("Buddy server running!");
  });
  router.use("/request", RequestRouter());
  router.use("/buddy", BuddyRouter());
  return router;
}
