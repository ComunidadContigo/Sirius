import { Request, Response, Router } from "express";
import { Pool } from "pg";
import HttpError from "../../common/models/error.model";
import HttpResponse from "../../common/models/response.model";
import RequestController from "../controllers/request.controller";
import ReqModel from "../models/request.model";

export default function UserRouter(): Router {
  const userController: RequestController = new RequestController();
  const router: Router = Router();

  /**
   * Get All Requests
   * GET /request
   * Optional Body = {limit: number} to limit amount of results.
   */
  router.get("/", (req: Request, res: Response) => {
    const db: Pool = req.app.get("dbPool");
    // TODO add functionality to handle LIMIT.
    userController.getAllRequests(db).then(
      (users: ReqModel[]) => {
        const response: HttpResponse<ReqModel[]> = {
          success: true,
          returnCode: 200,
          messages: [],
          errors: [],
          data: users,
          rowCount: users.length,
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
  router.get("/:id", (req: Request, res: Response) => {
    const db: Pool = req.app.get("dbPool");
    userController.getRequestByID(db, +req.params.id).then(
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
  router.post("/", (req: Request, res: Response) => {
    const db: Pool = req.app.get("dbPool");
    userController.createRequest(db, req.body as ReqModel).then(
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
  router.put("/:id", (req: Request, res: Response) => {
    const db: Pool = req.app.get("dbPool");
    userController
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
  router.delete("/:id", (req: Request, res: Response) => {
    const db: Pool = req.app.get("dbPool");
    userController.deleteRequestByID(db, +req.params.id).then(
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
