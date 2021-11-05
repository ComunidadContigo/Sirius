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
   * Get All Buddies
   * GET /buddy
   * Optional Body = {limit: number} to limit amount of results.
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
   * Get Buddy by ID
   * GET /buddy/:id
   */
  router.get("/:id", AuthMiddleware, (req: Request, res: Response) => {
    const db: Pool = req.app.get("dbPool");
    buddyController.getBuddyByID(db, +req.params.id).then(
      (reqmod: Buddy) => {
        const response: HttpResponse<Buddy> = {
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
   * Create Buddy
   * POST /buddy
   * Body should match the buddy model.
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
   * Update Buddy by ID
   * PUT /buddy/:id
   * Body should match the buddy model.
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
   * Delete Buddy by ID
   * DELETE /buddy/:id
   *
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

  router.get("/user/:id", AuthMiddleware, (req: Request, res: Response) => {
    const db: Pool = req.app.get("dbPool");
    buddyController.getBuddyByUID(db, +req.params.id).then(
      (reqmod: Buddy) => {
        const response: HttpResponse<Buddy> = {
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

  return router;
}
