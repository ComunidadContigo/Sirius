import { Router, Request, Response } from "express";

export default function api_router(): Router {
  const router: Router = Router();
  router.get("/health", (req: Request, res: Response) => {
    res.status(200).send("Buddy server running!");
  });
  return router;
}
