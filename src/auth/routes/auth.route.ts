import { Request, Response, Router } from "express";
import { Pool } from "pg";
import HttpError from "../../common/models/error.model";
import HttpResponse from "../../common/models/response.model";
import AuthController from "../../auth/controllers/auth.controller";
import { RefreshToken } from "../models/auth.model";

export default function AuthRouter(): Router {
  const authController: AuthController = new AuthController();
  const router: Router = Router();

  /**
   * Login user
   * POST /user/login
   */
  router.post("/login", (req: Request, res: Response) => {
    const db: Pool = req.app.get("dbPool");
    authController.login(db, req.body.email, req.body.password).then(
      (refreshToken: RefreshToken) => {
        const response: HttpResponse<RefreshToken> = {
          success: true,
          returnCode: 201,
          messages: ["User Logged in!"],
          errors: [],
          data: refreshToken,
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

  router.delete("/logout/:id", (req: Request, res: Response) => {
    const db: Pool = req.app.get("dbPool");
    authController.logout(db, +req.params.id).then(
      (success: boolean) => {
        const response: HttpResponse<RefreshToken> = {
          success: success,
          returnCode: 203,
          messages: ["All user refresh tokens deleted"],
          errors: [],
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

  router.post("/token", (req: Request, res: Response) => {
    const db: Pool = req.app.get("dbPool");
    authController.authenticate(db, req.body as RefreshToken).then(
      (token: string) => {
        const response: HttpResponse<string> = {
          success: true,
          returnCode: 201,
          messages: ["Access token granted."],
          errors: [],
          data: token,
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
