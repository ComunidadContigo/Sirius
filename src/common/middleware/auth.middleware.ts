import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import environmentConfig from "../config/environment.config";
import HttpResponse from "../models/response.model";

export default function (req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    const response: HttpResponse = {
      success: false,
      returnCode: 401,
      messages: [],
      errors: ["Authorization token not supplied"],
    };
    return res.status(response.returnCode).send(response);
  }

  jwt.verify(token, environmentConfig.secret_key, (err) => {
    if (err) {
      const response: HttpResponse = {
        success: false,
        returnCode: 403,
        messages: [],
        errors: [err.message, err.stack || ""],
      };
      return res.status(response.returnCode).send(response);
    }
    next();
  });
}
