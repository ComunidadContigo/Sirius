import { Request, Response, Router } from "express";
import { Pool } from "pg";
import User from "../../user/models/user.model";
import HttpError from "../../common/models/error.model";
import HttpResponse from "../../common/models/response.model";
import AuthController from "../../auth/controllers/auth.controller";

export default function AuthRouter(): Router {
  const authController: AuthController = new AuthController();
  const router: Router = Router();

  /**
   * Login user
   * POST /user/login
   */
  router.post("/login", (req: Request, res: Response) => {
    const db: Pool = req.app.get("dbPool");
    authController.authenticate(db, req.body.email, req.body.password).then(
      (user: User) => {
        const response: HttpResponse<User> = {
          success: true,
          returnCode: 201,
          messages: ["User Logged in!"],
          errors: [],
          data: user,
        };
        res.status(response.returnCode).send(response);
      },
      (err) => {
        let response: HttpResponse;
        if (err instanceof HttpError) {
          response = {
            success: false,
            returnCode: err.status,
            messages: [],
            errors: [err.message, err.stack || ""],
          };
        } else {
          response = {
            success: false,
            returnCode: 500,
            messages: [],
            errors: [err.message, err.stack || ""],
          };
        }
        res.status(response.returnCode).send(response);
      }
    );
  });

  return router;
}
