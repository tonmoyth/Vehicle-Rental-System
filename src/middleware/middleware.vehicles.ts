import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../database/db";

export const vehicles = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const tokenWithBearer = req.headers.authorization;
    const token = tokenWithBearer?.split(" ")[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: "unauthorized access",
      });
    }
    const secret = config.jwt_secret;
    const decoded = jwt.verify(token as string, secret as string) as JwtPayload;

    const user = await pool.query(
      `
        SELECT * FROM users WHERE email=$1
        `,
      [decoded.email]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "users not found",
      });
    }

    req.user = decoded;
    console.log(decoded.role);
    console.log(roles);

    if (roles.length && !roles.includes(decoded.role)) {
      return res.status(400).json({
        success: false,
        message: "this role cannot access",
      });
    }

    next();
  };
};
