import { Router } from "express";
import AuthRouter from "./auth.route";

export default function api_router(): Router {
  const router: Router = Router();
  router.use("/auth", AuthRouter());
  return router;
}
