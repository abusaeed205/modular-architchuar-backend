import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config/index.js";
import { pool } from "../db/index.js";
import type { ROLES } from "../role types/role.js";

const auth = (...roles: ROLES[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    console.log(roles);
    try {
      const token = req.headers.authorization;

      if (!token) {
        res.status(500).json({
          success: false,
          message: "unauthorized access!!",
        });
      }

      const decoded = jwt.verify(
        token as string,
        config.secret as string,
      ) as JwtPayload;
      console.log(decoded);

      const userData = await pool.query(
        `
      SELECT * FROM users WHERE email=$1
      `,
        [decoded.email],
      );

      const user = userData.rows[0];

      if (userData.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: "Unauthorized access !!",
        });
      }

      console.log("Auth Role:", user.roles);

      if (!user?.is_active) {
        res.status(404).json({
          success: false,
          message: "Forbidden!",
        });
      }

      if (roles.length && !roles.includes(user.role)) {
        res.status(403).json({
          success: false,
          message: "Forbidden!!",
        });
      }

      req.user = decoded;

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
