import { Request, Response, Router } from "express";
import { Pool } from "pg";
import HttpError from "../../common/models/error.model";
import HttpResponse from "../../common/models/response.model";
import BuddyController from "../controllers/buddy.controller";
import Buddy from "../../buddy/models/buddy.model";
import AuthMiddleware from "../../common/middleware/auth.middleware";

export default function BuddyRouter(): Router {
  const buddyController: BuddyController = new BuddyController();
  const router: Router = Router();

  /**
   * @api {get} / Get All Buddies
   * @apiName GetAllBuddies
   * @apiGroup Buddy
   *
   *
   * @apiSuccess (200) {Boolean} success Whether the API request was successful or not.
   * @apiSuccess (200) {Number} returnCode Return code of the response.
   * @apiSuccess (200) {String[]} messages Any relevant information about the processing of the request.
   * @apiSuccess (200) {String[]} errors Any errors returned by the processing of the request.
   * @apiSuccess (200) {Buddy[]} data List of all buddies.
   * @apiSuccess (200) {Number} rowCount Amount of buddies.
   */
  router.get("/", AuthMiddleware, (req: Request, res: Response) => {
    const db: Pool = req.app.get("dbPool");
    // TODO add functionality to handle LIMIT.
    buddyController.getAllBuddies(db).then(
      (buddies: Buddy[]) => {
        const response: HttpResponse<Buddy[]> = {
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
   * @api {get} /:id Get Buddy by ID
   * @apiName GetBuddyByID
   * @apiGroup Buddy
   *
   * @apiParam {Number} id Id for the buddy to get
   *
   * @apiSuccess (200) {Boolean} success Whether the API request was successful or not.
   * @apiSuccess (200) {Number} returnCode Return code of the response.
   * @apiSuccess (200) {String[]} messages Any relevant information about the processing of the request.
   * @apiSuccess (200) {String[]} errors Any errors returned by the processing of the request.
   * @apiSuccess (200) {Buddy} data Any data returned by the request.
   * @apiSuccess (200) {Number} data.b_id Buddy ID.
   * @apiSuccess (200) {Number} data.buddy_rating_avg Buddy rating average.
   * @apiSuccess (200) {Boolean} data.is_active Used to check if a Buddy is accepting requests.
   * @apiSuccess (200) {Number} data.u_id Buddy User ID.
   */
  router.get("/:id", AuthMiddleware, (req: Request, res: Response) => {
    const db: Pool = req.app.get("dbPool");
    buddyController.getBuddyByID(db, +req.params.id).then(
      (buddy: Buddy) => {
        const response: HttpResponse<Buddy> = {
          success: true,
          returnCode: 200,
          messages: [],
          errors: [],
          data: buddy,
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
   * @api {post} / Create a new Buddy
   * @apiName createBuddy
   * @apiGroup Buddy
   *
   * @apiBody {Buddy} Buddy Buddy Details
   *
   * @apiSuccess (201) {Boolean} success Whether the API request was successful or not.
   * @apiSuccess (201) {Number} returnCode Return code of the response.
   * @apiSuccess (201) {String[]} messages Any relevant information about the processing of the request.
   * @apiSuccess (201) {String[]} errors Any errors returned by the processing of the request.
   */
  router.post("/", AuthMiddleware, (req: Request, res: Response) => {
    const db: Pool = req.app.get("dbPool");
    buddyController.createBuddy(db, req.body as Buddy).then(
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
   * @api {put} /:id Update a Buddy by ID
   * @apiName updateBuddyById
   * @apiGroup Buddy
   *
   * @apiParam {Number} id Id of the Buddy to be updated
   * @apiBody {Buddy} Buddy Buddy Details
   *
   * @apiSuccess (202) {Boolean} success Whether the API request was successful or not.
   * @apiSuccess (202) {Number} returnCode Return code of the response.
   * @apiSuccess (202) {String[]} messages Any relevant information about the processing of the request.
   * @apiSuccess (202) {String[]} errors Any errors returned by the processing of the request.
   */
  router.put("/:id", AuthMiddleware, (req: Request, res: Response) => {
    const db: Pool = req.app.get("dbPool");
    buddyController.updateBuddyByID(db, +req.params.id, req.body as Buddy).then(
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
   * @api {delete} /:id Delete a Buddy by ID
   * @apiName deleteBuddyById
   * @apiGroup Buddy
   *
   * @apiParam {Number} id Id of the Buddy to be deleted
   *
   * @apiSuccess (203) {Boolean} success Whether the API request was successful or not.
   * @apiSuccess (203) {Number} returnCode Return code of the response.
   * @apiSuccess (203) {String[]} messages Any relevant information about the processing of the request.
   * @apiSuccess (203) {String[]} errors Any errors returned by the processing of the request.
   */
  router.delete("/:id", AuthMiddleware, (req: Request, res: Response) => {
    const db: Pool = req.app.get("dbPool");
    buddyController.deleteBuddyByID(db, +req.params.id).then(
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

  /**
   * @api {get} /:id Get Buddy by User ID
   * @apiName GetBuddyByUID
   * @apiGroup Buddy
   *
   * @apiParam {Number} id User Id for the buddy to get
   *
   * @apiSuccess (200) {Boolean} success Whether the API request was successful or not.
   * @apiSuccess (200) {Number} returnCode Return code of the response.
   * @apiSuccess (200) {String[]} messages Any relevant information about the processing of the request.
   * @apiSuccess (200) {String[]} errors Any errors returned by the processing of the request.
   * @apiSuccess (200) {Buddy} data Any data returned by the request.
   * @apiSuccess (200) {Number} data.b_id Buddy ID.
   * @apiSuccess (200) {Number} data.buddy_rating_avg Buddy rating average.
   * @apiSuccess (200) {Boolean} data.is_active Used to check if a Buddy is accepting requests.
   * @apiSuccess (200) {Number} data.u_id Buddy User ID.
   */
  router.get("/user/:id", AuthMiddleware, (req: Request, res: Response) => {
    const db: Pool = req.app.get("dbPool");
    buddyController.getBuddyByUID(db, +req.params.id).then(
      (buddy: Buddy) => {
        const response: HttpResponse<Buddy> = {
          success: true,
          returnCode: 200,
          messages: [],
          errors: [],
          data: buddy,
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
