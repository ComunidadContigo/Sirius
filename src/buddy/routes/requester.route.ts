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
   * @api {get} / Get All Requesters
   * @apiName GetAllRequesters
   * @apiGroup Requester
   *
   *
   * @apiSuccess (200) {Boolean} success Whether the API request was successful or not.
   * @apiSuccess (200) {Number} returnCode Return code of the response.
   * @apiSuccess (200) {String[]} messages Any relevant information about the processing of the request.
   * @apiSuccess (200) {String[]} errors Any errors returned by the processing of the request.
   * @apiSuccess (200) {Requester[]} data List of all requesters.
   * @apiSuccess (200) {Number} rowCount Amount of requesters.
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
   * @api {get} /:id Get Requester by ID
   * @apiName GetRequesterByID
   * @apiGroup Requester
   *
   * @apiParam {Number} id Requester ID.
   *
   * @apiSuccess (200) {Boolean} success Whether the API request was successful or not.
   * @apiSuccess (200) {Number} returnCode Return code of the response.
   * @apiSuccess (200) {String[]} messages Any relevant information about the processing of the request.
   * @apiSuccess (200) {String[]} errors Any errors returned by the processing of the request.
   * @apiSuccess (200) {Requester} data Any data returned by the request.
   * @apiSuccess (200) {Number} data.r_id Requester ID.
   * @apiSuccess (200) {Number} data.requester_rating_avg Requester rating average.
   * @apiSuccess (200) {Number} data.u_id Requester User ID.
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

  /**
   * @api {get} /user/:id Get Requester by User ID
   * @apiName GetRequesterByUID
   * @apiGroup Requester
   *
   * @apiParam {Number} id User Id for the requester to get
   *
   * @apiSuccess (200) {Boolean} success Whether the API request was successful or not.
   * @apiSuccess (200) {Number} returnCode Return code of the response.
   * @apiSuccess (200) {String[]} messages Any relevant information about the processing of the request.
   * @apiSuccess (200) {String[]} errors Any errors returned by the processing of the request.
   * @apiSuccess (200) {Requester} data Any data returned by the request.
   * @apiSuccess (200) {Number} data.r_id Requester ID.
   * @apiSuccess (200) {Number} data.requester_rating_avg Requester rating average.
   * @apiSuccess (200) {Number} data.u_id Requester User ID.
   */
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
   * @api {post} / Create a new Requester
   * @apiName createRequester
   * @apiGroup Requester
   *
   * @apiBody {Requester} Requester Requester Details
   *
   * @apiSuccess (201) {Boolean} success Whether the API request was successful or not.
   * @apiSuccess (201) {Number} returnCode Return code of the response.
   * @apiSuccess (201) {String[]} messages Any relevant information about the processing of the request.
   * @apiSuccess (201) {String[]} errors Any errors returned by the processing of the request.
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
   * @api {put} /:id Update a Requester by ID
   * @apiName updateRequesterById
   * @apiGroup Requester
   *
   * @apiParam {Number} id Id of the Requester to be updated
   * @apiBody {Requester} Requester Requester Details
   *
   * @apiSuccess (202) {Boolean} success Whether the API request was successful or not.
   * @apiSuccess (202) {Number} returnCode Return code of the response.
   * @apiSuccess (202) {String[]} messages Any relevant information about the processing of the request.
   * @apiSuccess (202) {String[]} errors Any errors returned by the processing of the request.
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
   * @api {delete} /:id Delete a Requester by ID
   * @apiName deleteRequesterById
   * @apiGroup Requester
   *
   * @apiParam {Number} id Id of the Requester to be deleted
   *
   * @apiSuccess (203) {Boolean} success Whether the API request was successful or not.
   * @apiSuccess (203) {Number} returnCode Return code of the response.
   * @apiSuccess (203) {String[]} messages Any relevant information about the processing of the request.
   * @apiSuccess (203) {String[]} errors Any errors returned by the processing of the request.
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
