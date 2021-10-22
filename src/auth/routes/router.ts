import { Router, Request, Response } from "express";
import AuthRouter from "./auth.route";

export default function api_router(): Router {
  const router: Router = Router();
  router.get("/health", (req: Request, res: Response) => {
    res.status(200).send("Auth server running!");
  });
  router.use("/", AuthRouter());
  return router;
}
