import { Router } from "express";
import RequestRouter from "./request.route";

export default function api_router(): Router {
  const router: Router = Router();
  router.use("/request", RequestRouter());
  return router;
}
