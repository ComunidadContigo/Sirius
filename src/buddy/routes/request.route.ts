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
   * @api {get} / Get All Requests
   * @apiName GetAllRequests
   * @apiGroup Request
   *
   *
   * @apiSuccess (200) {Boolean} success Whether the API request was successful or not.
   * @apiSuccess (200) {Number} returnCode Return code of the response.
   * @apiSuccess (200) {String[]} messages Any relevant information about the processing of the request.
   * @apiSuccess (200) {String[]} errors Any errors returned by the processing of the request.
   * @apiSuccess (200) {ReqModel[]} data List of all requests.
   * @apiSuccess (200) {Number} rowCount Amount of requests.
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
   * @api {get} /new/:id Get Request eligible to be sent to a User by ID
   * @apiName FindNewEligibleRequests
   * @apiGroup Request
   *
   * @apiParams {Number} id Id for the user that sent request
   *
   * @apiSuccess (200) {Boolean} success Whether the API request was successful or not.
   * @apiSuccess (200) {Number} returnCode Return code of the response.
   * @apiSuccess (200) {String[]} messages Any relevant information about the processing of the request.
   * @apiSuccess (200) {String[]} errors Any errors returned by the processing of the request.
   * @apiSuccess (200) {Request[]} data.requests List of all eligible requests.
   * @apiSuccess (200) {Number} rowCount Amount of requests.
   */
  router.get("/new/:id", AuthMiddleware, (req: Request, res: Response) => {
    const db: Pool = req.app.get("dbPool");
    requestController.findNewEligibleRequests(db, +req.params.id).then(
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
   * @api {get} /:id Get Request by ID
   * @apiName GetRequestByID
   * @apiGroup Request
   *
   * @apiParams {Number} id Id for the request to get
   *
   * @apiSuccess (200) {Boolean} success Whether the API request was successful or not.
   * @apiSuccess (200) {Number} returnCode Return code of the response.
   * @apiSuccess (200) {String[]} messages Any relevant information about the processing of the request.
   * @apiSuccess (200) {String[]} errors Any errors returned by the processing of the request.
   * @apiSuccess (200) {ReqModel} data Any data returned by the request.
   * @apiSuccess (200) {ReqModel} data.rq_id Request ID.
   * @apiSuccess (200) {Number} data.request_date Buddy rating average.
   * @apiSuccess (200) {Boolean} data.request_meeting_point Meeting point coordinates.
   * @apiSuccess (200) {Number} data.stat String status to keep track of requests.
   * @apiSuccess (200) {Number} data.request_destination Destination point coordinates.
   * @apiSuccess (200) {Number} data.r_id ID of the requester that made the request.
   * @apiSuccess (200) {Number} data.b_id ID of the Buddy that accepted.
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
   * @api {post} / Create a new Request
   * @apiName createRequest
   * @apiGroup Request
   *
   * @apiBody {ReqModel} Request Request Details
   *
   * @apiSuccess (201) {Boolean} success Whether the API request was successful or not.
   * @apiSuccess (201) {Number} returnCode Return code of the response.
   * @apiSuccess (201) {String[]} messages Any relevant information about the processing of the request.
   * @apiSuccess (201) {String[]} errors Any errors returned by the processing of the request.
   * @apiSuccess (201) {Number} data Request ID for further processing.
   */
  router.post("/", AuthMiddleware, (req: Request, res: Response) => {
    const db: Pool = req.app.get("dbPool");
    requestController.createRequest(db, req.body as ReqModel).then(
      (rqid: number) => {
        const response: HttpResponse<number> = {
          success: true,
          returnCode: 201,
          messages: [],
          errors: [],
          data: rqid,
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
   * @api {put} /:id Update a Request by ID
   * @apiName updateRequestById
   * @apiGroup Request
   *
   * @apiParams {Number} id Id of the Request to be updated
   * @apiBody {Request} ReqModel Request Details
   *
   * @apiSuccess (202) {Boolean} success Whether the API request was successful or not.
   * @apiSuccess (202) {Number} returnCode Return code of the response.
   * @apiSuccess (202) {String[]} messages Any relevant information about the processing of the request.
   * @apiSuccess (202) {String[]} errors Any errors returned by the processing of the request.
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
   * @api {delete} /:id Delete a Request by ID
   * @apiName deleteRequestById
   * @apiGroup Request
   *
   * @apiParams {Number} id Id of the Request to be deleted
   *
   * @apiSuccess (203) {Boolean} success Whether the API request was successful or not.
   * @apiSuccess (203) {Number} returnCode Return code of the response.
   * @apiSuccess (203) {String[]} messages Any relevant information about the processing of the request.
   * @apiSuccess (203) {String[]} errors Any errors returned by the processing of the request.
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
