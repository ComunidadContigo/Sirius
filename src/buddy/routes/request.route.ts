import { Request, Response, Router } from "express";
import { Pool } from "pg";
import HttpError from "../../common/models/error.model";
import HttpResponse from "../../common/models/response.model";
import RequestController from "../controllers/request.controller";
import ReqModel from "../models/request.model";
import AuthMiddleware from "../../common/middleware/auth.middleware";

export default function RequestRouter(): Router {
  const requestController: RequestController = new RequestController();
  const router: Router = Router();

  /**
   * Get All Requests
   * GET /request
   * Optional Body = {limit: number} to limit amount of results.
   */
  router.get("/", AuthMiddleware, (req: Request, res: Response) => {
    const db: Pool = req.app.get("dbPool");
    // TODO add functionality to handle LIMIT.
    requestController.getAllRequests(db).then(
      (requests: ReqModel[]) => {
        const response: HttpResponse<ReqModel[]> = {
          success: true,
          returnCode: 200,
          messages: [],
          errors: [],
          data: requests,
          rowCount: requests.length,
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
            errors: [err.message],
          };
        }
        res.status(response.returnCode).send(response);
      }
    );
  });

  /**
   * Get Request by isFulfilled
   * GET /request/isfulfilled
   * Returns all requests that need to be fulfilled.
   */
  router.get("/is_fulfilled", AuthMiddleware, (req: Request, res: Response) => {
    const db: Pool = req.app.get("dbPool");
    requestController.getRequestByisFulfilled(db).then(
      (requests: ReqModel[]) => {
        const response: HttpResponse<ReqModel[]> = {
          success: true,
          returnCode: 200,
          messages: [],
          errors: [],
          data: requests,
          rowCount: requests.length,
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
            errors: [err.message],
          };
        }
        res.status(response.returnCode).send(response);
      }
    );
  });

  /**
   * Get Request by ID
   * GET /request/:id
   */
  router.get("/:id", AuthMiddleware, (req: Request, res: Response) => {
    const db: Pool = req.app.get("dbPool");
    requestController.getRequestByID(db, +req.params.id).then(
      (reqmod: ReqModel) => {
        const response: HttpResponse<ReqModel> = {
          success: true,
          returnCode: 200,
          messages: [],
          errors: [],
          data: reqmod,
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
            errors: [err.message],
          };
        }
        res.status(response.returnCode).send(response);
      }
    );
  });

  /**
   * Create Request
   * POST /request
   * Body should match the request model.
   */
  router.post("/", AuthMiddleware, (req: Request, res: Response) => {
    const db: Pool = req.app.get("dbPool");
    requestController.createRequest(db, req.body as ReqModel).then(
      (success: boolean) => {
        const response: HttpResponse = {
          success: success,
          returnCode: 201,
          messages: [],
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
            errors: [err.message],
          };
        }
        res.status(response.returnCode).send(response);
      }
    );
  });

  /**
   * Update Request by ID
   * PUT /request/:id
   * Body should match the request model.
   */
  router.put("/:id", AuthMiddleware, (req: Request, res: Response) => {
    const db: Pool = req.app.get("dbPool");
    requestController
      .updateRequestByID(db, +req.params.id, req.body as ReqModel)
      .then(
        (success: boolean) => {
          const response: HttpResponse = {
            success: success,
            returnCode: 202,
            messages: [],
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
              errors: [err.message],
            };
          }
          res.status(response.returnCode).send(response);
        }
      );
  });

  /**
   * Delete Request by ID
   * DELETE /request/:id
   *
   */
  router.delete("/:id", AuthMiddleware, (req: Request, res: Response) => {
    const db: Pool = req.app.get("dbPool");
    requestController.deleteRequestByID(db, +req.params.id).then(
      (success: boolean) => {
        const response: HttpResponse = {
          success: success,
          returnCode: 203,
          messages: [],
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
            errors: [err.message],
          };
        }
        res.status(response.returnCode).send(response);
      }
    );
  });

  return router;
}
