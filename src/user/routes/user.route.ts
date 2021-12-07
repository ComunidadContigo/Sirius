import { Request, Response, Router } from "express";
import { Pool } from "pg";
import HttpError from "../../common/models/error.model";
import HttpResponse from "../../common/models/response.model";
import UserController from "../controllers/user.controller";
import User from "../models/user.model";
import AuthMiddleware from "../../common/middleware/auth.middleware";
import multer from "multer";
import fs from "fs";
import util from "util";
import internal from "stream";

export default function UserRouter(): Router {
  const userController: UserController = new UserController();
  const router: Router = Router();
  const upload = multer({ dest: "uploads/" });
  const unlinkFile = util.promisify(fs.unlink);

  /**
   * @api {get} / Get All Users
   * @apiName GetAllUsers
   * @apiGroup User
   *
   *
   * @apiSuccess (200) {Boolean} success Whether the API request was successful or not.
   * @apiSuccess (200) {Number} returnCode Return code of the response.
   * @apiSuccess (200) {String[]} messages Any relevant information about the processing of the request.
   * @apiSuccess (200) {String[]} errors Any errors returned by the processing of the request.
   * @apiSuccess (200) {User[]} data List of all users.
   * @apiSuccess (200) {Number} rowCount Amount of users.
   */
  router.get("/", AuthMiddleware, (req: Request, res: Response) => {
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

  /**
   * @api {get} /:id Get User by ID
   * @apiName GetUserByID
   * @apiGroup User
   *
   * @apiParam {Number} id Id for the buddy to get
   *
   * @apiSuccess (200) {Boolean} success Whether the API request was successful or not.
   * @apiSuccess (200) {Number} returnCode Return code of the response.
   * @apiSuccess (200) {String[]} messages Any relevant information about the processing of the request.
   * @apiSuccess (200) {String[]} errors Any errors returned by the processing of the request.
   * @apiSuccess (200) {User} data Any data returned by the request.
   * @apiSuccess (200) {Number} data.u_id User ID.
   * @apiSuccess (200) {String} data.email User email address.
   * @apiSuccess (200) {String} data.password User password, hashed.
   * @apiSuccess (200) {String} data.phone_number User phone number.
   * @apiSuccess (200) {String} data.birth_date User birth date.
   * @apiSuccess (200) {String} data.first_name User first name.
   * @apiSuccess (200) {String} data.gender User gender.
   * @apiSuccess (200) {String} data.last_name User last name.
   * @apiSuccess (200) {String} data.user_last_location User last known location.
   * @apiSuccess (200) {String} data.picture User profile picture name.
   */
  router.get("/:id", AuthMiddleware, (req: Request, res: Response) => {
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

  /**
   * @api {post} / Create a new User
   * @apiName createUser
   * @apiGroup User
   *
   * @apiBody {User} User User Details
   *
   * @apiSuccess (201) {Boolean} success Whether the API request was successful or not.
   * @apiSuccess (201) {Number} returnCode Return code of the response.
   * @apiSuccess (201) {String[]} messages Any relevant information about the processing of the request.
   * @apiSuccess (201) {String[]} errors Any errors returned by the processing of the request.
   */
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

  // Update User Location By ID
  // PUT /user/location/:id
  // Body should match the user model.
  router.put("/location/:id", (req: Request, res: Response) => {
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

  /**
   * @api {delete} /:id Delete a User by ID
   * @apiName deleteUserById
   * @apiGroup User
   *
   * @apiParam {Number} id Id of the User to be deleted
   *
   * @apiSuccess (203) {Boolean} success Whether the API request was successful or not.
   * @apiSuccess (203) {Number} returnCode Return code of the response.
   * @apiSuccess (203) {String[]} messages Any relevant information about the processing of the request.
   * @apiSuccess (203) {String[]} errors Any errors returned by the processing of the request.
   */
  router.delete("/:id", AuthMiddleware, (req: Request, res: Response) => {
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

  /**
   * @api {put} /vetted/:id Update a Buddy by ID
   * @apiName vettingProcessComplete
   * @apiGroup User
   *
   * @apiParam {Number} id Id of the User to update vetting table.
   *
   * @apiSuccess (202) {Boolean} success Whether the API request was successful or not.
   * @apiSuccess (202) {Number} returnCode Return code of the response.
   * @apiSuccess (202) {String[]} messages Any relevant information about the processing of the request.
   * @apiSuccess (202) {String[]} errors Any errors returned by the processing of the request.
   */
  router.put("/vetted/:id", AuthMiddleware, (req: Request, res: Response) => {
    const db: Pool = req.app.get("dbPool");
    userController.vettingProcessComplete(db, +req.params.id).then(
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
   * @api {get} /requester/:id Get User by requester ID
   * @apiName getRequesterID
   * @apiGroup User
   *
   * @apiParam {Number} id Requester Id for the User to get
   *
   * @apiSuccess (200) {Boolean} success Whether the API request was successful or not.
   * @apiSuccess (200) {Number} returnCode Return code of the response.
   * @apiSuccess (200) {String[]} messages Any relevant information about the processing of the request.
   * @apiSuccess (200) {String[]} errors Any errors returned by the processing of the request.
   * @apiSuccess (200) {User} data Any data returned by the request.
   * @apiSuccess (200) {Number} data.u_id User ID.
   * @apiSuccess (200) {String} data.email User email address.
   * @apiSuccess (200) {String} data.password User password, hashed.
   * @apiSuccess (200) {String} data.phone_number User phone number.
   * @apiSuccess (200) {String} data.birth_date User birth date.
   * @apiSuccess (200) {String} data.first_name User first name.
   * @apiSuccess (200) {String} data.gender User gender.
   * @apiSuccess (200) {String} data.last_name User last name.
   * @apiSuccess (200) {String} data.user_last_location User last known location.
   * @apiSuccess (200) {String} data.picture User profile picture name.
   */
  router.get(
    "/requester/:id",
    AuthMiddleware,
    (req: Request, res: Response) => {
      const db: Pool = req.app.get("dbPool");
      userController.getRequesterID(db, +req.params.id).then(
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
    }
  );

  /**
   * @api {get} /buddy/:id Get User by Buddy ID
   * @apiName getBuddyID
   * @apiGroup User
   *
   * @apiParam {Number} id Buddy Id for the User to get
   *
   * @apiSuccess (200) {Boolean} success Whether the API request was successful or not.
   * @apiSuccess (200) {Number} returnCode Return code of the response.
   * @apiSuccess (200) {String[]} messages Any relevant information about the processing of the request.
   * @apiSuccess (200) {String[]} errors Any errors returned by the processing of the request.
   * @apiSuccess (200) {User} data Any data returned by the request.
   * @apiSuccess (200) {Number} data.u_id User ID.
   * @apiSuccess (200) {String} data.email User email address.
   * @apiSuccess (200) {String} data.password User password, hashed.
   * @apiSuccess (200) {String} data.phone_number User phone number.
   * @apiSuccess (200) {String} data.birth_date User birth date.
   * @apiSuccess (200) {String} data.first_name User first name.
   * @apiSuccess (200) {String} data.gender User gender.
   * @apiSuccess (200) {String} data.last_name User last name.
   * @apiSuccess (200) {String} data.user_last_location User last known location.
   * @apiSuccess (200) {String} data.picture User profile picture name.
   */
  router.get("/buddy/:id", AuthMiddleware, (req: Request, res: Response) => {
    const db: Pool = req.app.get("dbPool");
    userController.getBuddyID(db, +req.params.id).then(
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

  /**
   * @api {get} /isvetted/:id Check if User has been vetted.
   * @apiName isVetted
   * @apiGroup User
   *
   * @apiParam {Number} id Id for the User to get
   *
   * @apiSuccess (200) {Boolean} success Whether the API request was successful or not.
   * @apiSuccess (200) {Number} returnCode Return code of the response.
   * @apiSuccess (200) {String[]} messages Any relevant information about the processing of the request.
   * @apiSuccess (200) {String[]} errors Any errors returned by the processing of the request.
   * @apiSuccess (200) {Boolean} data Any data returned by the request.
   */
  router.get("/isvetted/:id", AuthMiddleware, (req: Request, res: Response) => {
    const db: Pool = req.app.get("dbPool");
    userController.isVetted(db, +req.params.id).then(
      (success: boolean) => {
        const response: HttpResponse<boolean> = {
          success: true,
          returnCode: 200,
          messages: [],
          errors: [],
          data: success,
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
   * @api {post} /profile/:id Create a new User
   * @apiName uploadPicture
   * @apiGroup User
   *
   * @apiParam {Number} User User ID to update user picture value.
   * @apiBody {file} User Profile Picture
   *
   * @apiSuccess (201) {Boolean} success Whether the API request was successful or not.
   * @apiSuccess (201) {Number} returnCode Return code of the response.
   * @apiSuccess (201) {String[]} messages Any relevant information about the processing of the request.
   * @apiSuccess (201) {String[]} errors Any errors returned by the processing of the request.
   */
  router.post(
    "/profile/:id",
    upload.single("image"),
    (req: Request, res: Response) => {
      const db: Pool = req.app.get("dbPool");
      const file = req.file;

      userController.uploadPicture(db, +req.params.id, file).then(
        (success: boolean) => {
          const response: HttpResponse = {
            success: success,
            returnCode: 201,
            messages: [],
            errors: [],
          };
          res.status(response.returnCode).send(response);
          console.log(file);
          unlinkFile((file as Express.Multer.File).path);
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
    }
  );

  // Get User Profile Picture by ID
  // GET /user/picture/:id
  router.get("/profile/:id", async (req: Request, res: Response) => {
    const db: Pool = req.app.get("dbPool");
    const picture = await userController.getUserPicture(db, +req.params.id);
    picture.pipe(res);
  });

  // Get picture key
  // GET /user/picture/:key
  router.get("/picture/:key", async (req: Request, res: Response) => {
    const picture = await userController.getPicture(req.params.key);
    picture.pipe(res);
  });

  return router;
}
