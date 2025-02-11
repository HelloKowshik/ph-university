import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import jwt, { decode, JwtPayload } from "jsonwebtoken";
import AppError from "../errors/AppError";
import status from "http-status";
import config from "../config";
import { TUserRole } from "../modules/User/user.interface";
import { User } from "../modules/User/user.model";

const auth = (...roles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
      throw new AppError(status.UNAUTHORIZED, "You are not Authorized!");
    }

    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string
    ) as JwtPayload;

    const { role, userId, iat } = decoded;

    const isUserExists = await User.isUserExistsByCustomId(userId);

    if (!isUserExists) {
      throw new AppError(status.NOT_FOUND, "User does not Exists!");
    }

    if (isUserExists?.isDeleted) {
      throw new AppError(status.FORBIDDEN, "User is Deleted!");
    }

    if (isUserExists?.status === "blocked") {
      throw new AppError(status.FORBIDDEN, "User is Blocked!");
    }

    if (
      User.isValidJWTIssue(
        isUserExists?.passwordChangedAt as Date,
        iat as number
      )
    ) {
      throw new AppError(status.UNAUTHORIZED, "You are not Authorized!");
    }

    if (roles && !roles.includes(role)) {
      throw new AppError(status.UNAUTHORIZED, "You are not Authorized!");
    }

    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
