import { Request, Response, Router } from "express";
import { Pool } from "pg";
import HttpError from "../../common/models/error.model";
import HttpResponse from "../../common/models/response.model";
import UserController from "../controllers/user.controller";
import User from "../models/user.model";

export default function UserRouter(): Router {
  const userController: UserController = new UserController();
  const router: Router = Router();

  // Get All Users
  // GET /user
  // Optional Body = { limit: number } to limit the results.
  router.get("/", (req: Request, res: Response) => {
    const db: Pool = req.app.get("dbPool");
    // TODO add functionality to handle LIMIT.
    userController.getAllUsers(db).then(
      (users: User[]) => {
        const response: HttpResponse<User[]> = {
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

  // Get User by ID
  // GET /user/:id
  router.get("/:id", (req: Request, res: Response) => {
    const db: Pool = req.app.get("dbPool");
    userController.getUserByID(db, +req.params.id).then(
      (user: User) => {
        const response: HttpResponse<User> = {
          success: true,
          returnCode: 200,
          messages: [],
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
            errors: [err.message],
          };
        }
        res.status(response.returnCode).send(response);
      }
    );
  });

  // Create User
  // POST /user
  // Body should match the user model.
  router.post("/", (req: Request, res: Response) => {
    const db: Pool = req.app.get("dbPool");
    userController.createUser(db, req.body as User).then(
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

  // Update User By ID
  // PUT /user/:id
  // Body should match the user model.
  router.put("/:id", (req: Request, res: Response) => {
    const db: Pool = req.app.get("dbPool");
    userController.updateUserByID(db, +req.params.id, req.body as User).then(
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

  // Delete User By ID
  // DELETE /user/:id
  router.delete("/:id", (req: Request, res: Response) => {
    const db: Pool = req.app.get("dbPool");
    userController.deleteUserByID(db, +req.params.id).then(
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
