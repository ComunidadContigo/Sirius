import { Router } from "express";
import UserRouter from "./user.route";

export default function api_router(): Router {
  const router: Router = Router();
  router.use("/user", UserRouter());
  return router;
}
