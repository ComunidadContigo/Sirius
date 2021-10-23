import { Router, Request, Response } from "express";
import UserRouter from "./user.route";

export default function api_router(): Router {
  const router: Router = Router();
  router.get("/health", (req: Request, res: Response) => {
    res.status(200).send("User server running!");
  });
  router.use("/", UserRouter());
  return router;
}
