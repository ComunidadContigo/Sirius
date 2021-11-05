import { Request, Response, Router } from "express";
import { Pool } from "pg";
import HttpError from "../../common/models/error.model";
import HttpResponse from "../../common/models/response.model";
import RequesterController from "../controllers/requester.controller";
import Requester from "../../buddy/models/requester.model";
import AuthMiddleware from "../../common/middleware/auth.middleware";

export default function RequesterRouter(): Router {
  const requesterController: RequesterController = new RequesterController();
  const router: Router = Router();

  /**
   * Get All Requesters
   * GET /requester
   * Optional Body = {limit: number} to limit amount of results.
   */
  router.get("/", AuthMiddleware, (req: Request, res: Response) => {
    const db: Pool = req.app.get("dbPool");
    // TODO add functionality to handle LIMIT.
    requesterController.getAllRequesters(db).then(
      (buddies: Requester[]) => {
        const response: HttpResponse<Requester[]> = {
          success: true,
          returnCode: 200,
          messages: [],
          errors: [],
          data: buddies,
          rowCount: buddies.length,
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
   * Get Requester by ID
   * GET /requester/:id
   */
  router.get("/:id", AuthMiddleware, (req: Request, res: Response) => {
    const db: Pool = req.app.get("dbPool");
    requesterController.getRequesterByID(db, +req.params.id).then(
      (reqmod: Requester) => {
        const response: HttpResponse<Requester> = {
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

  router.get("/user/:id", AuthMiddleware, (req: Request, res: Response) => {
    const db: Pool = req.app.get("dbPool");
    requesterController.getRequesterByUID(db, +req.params.id).then(
      (reqmod: Requester) => {
        const response: HttpResponse<Requester> = {
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
   * Create Requester
   * POST /requester
   * Body should match the requester model.
   */
  router.post("/", AuthMiddleware, (req: Request, res: Response) => {
    const db: Pool = req.app.get("dbPool");
    requesterController.createRequester(db, req.body as Requester).then(
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
   * Update Requester by ID
   * PUT /requester/:id
   * Body should match the requester model.
   */
  router.put("/:id", AuthMiddleware, (req: Request, res: Response) => {
    const db: Pool = req.app.get("dbPool");
    requesterController
      .updateRequesterByID(db, +req.params.id, req.body as Requester)
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
   * Delete Requester by ID
   * DELETE /requester/:id
   *
   */
  router.delete("/:id", AuthMiddleware, (req: Request, res: Response) => {
    const db: Pool = req.app.get("dbPool");
    requesterController.deleteRequesterByID(db, +req.params.id).then(
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
