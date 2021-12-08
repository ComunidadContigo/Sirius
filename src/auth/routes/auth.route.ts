import { Request, Response, Router } from "express";
import { Pool } from "pg";
import HttpError from "../../common/models/error.model";
import HttpResponse from "../../common/models/response.model";
import AuthController from "../../auth/controllers/auth.controller";
import { RefreshToken } from "../models/auth.model";
import authMiddleware from "../../common/middleware/auth.middleware";

export default function AuthRouter(): Router {
  const authController: AuthController = new AuthController();
  const router: Router = Router();

  /**
   * @api {post} /login/ Login to Contigo
   * @apiName Login
   * @apiGroup Auth
   *
   * @apiBody {String} email E-mail of the User.
   * @apiBody {String} password Password of the User.
   *
   * @apiSuccess (201) {Boolean} success Whether the API request was successful or not.
   * @apiSuccess (201) {Number} returnCode Return code of the response.
   * @apiSuccess (201) {String[]} messages Any relevant information about the processing of the request.
   * @apiSuccess (201) {String[]} errors Any errors returned by the processing of the request.
   * @apiSuccess (201) {RefreshToken} data Any data returned by the request.
   * @apiSuccess (201) {Number} data.u_id User that just logged in.
   * @apiSuccess (201) {String} data.token JWT that contains information about the logged in User.
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

  /**
   * @api {delete} /logout/:id Logout of Contigo
   * @apiName Logout
   * @apiGroup Auth
   *
   * @apiParam {Number} id ID of the user.
   *
   * @apiSuccess (203) {Boolean} success Whether the API request was successful or not.
   * @apiSuccess (203) {Number} returnCode Return code of the response.
   * @apiSuccess (203) {String[]} messages Any relevant information about the processing of the request.
   * @apiSuccess (203) {String[]} errors Any errors returned by the processing of the request.
   */
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

  /**
   * @api {post} /token/ Logout of Contigo
   * @apiName Logout
   * @apiGroup Auth
   *
   * @apiBody {RefreshToken} RefreshToken RefreshToken of the User.
   *
   * @apiSuccess (203) {Boolean} success Whether the API request was successful or not.
   * @apiSuccess (203) {Number} returnCode Return code of the response.
   * @apiSuccess (203) {String[]} messages Any relevant information about the processing of the request.
   * @apiSuccess (203) {String[]} errors Any errors returned by the processing of the request.
   * @apiSuccess (203) {String} data JWT that contains information about the logged in User.
   */
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

  /**
   * @api {put} /expo/:id Save Expo Token of Contigo
   * @apiName ExpoToken
   * @apiGroup Auth
   *
   * @apiBody {String} Refresh Token of the User.
   * @ {Number} id User Id
   *
   * @apiSuccess (203) {Boolean} success Whether the API request was successful or not.
   * @apiSuccess (203) {Number} returnCode Return code of the response.
   * @apiSuccess (203) {String[]} messages Any relevant information about the processing of the request.
   * @apiSuccess (203) {String[]} errors Any errors returned by the processing of the request.
   */
  router.put("/expo/:id", authMiddleware, (req: Request, res: Response) => {
    const db: Pool = req.app.get("dbPool");
    authController.saveExpoToken(db, req.body.token, +req.params.id).then(
      (success: boolean) => {
        const response: HttpResponse = {
          success: success,
          returnCode: 201,
          messages: ["Expo Push Token saved."],
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

  return router;
}
