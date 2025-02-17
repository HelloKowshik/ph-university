import status from "http-status";
import AppError from "../../errors/AppError";
import { User } from "../User/user.model";
import { TLoginUser, TPassword } from "./auth.interface";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import bcrypt from "bcrypt";
import { createToken } from "./auth.utils";
import { sendEmail } from "../../utils/sendEmail";

const loginUser = async (payload: TLoginUser) => {
  const isUserExists = await User.isUserExistsByCustomId(payload?.id);

  if (!isUserExists) {
    throw new AppError(status.NOT_FOUND, "User does not Exists!");
  }

  if (isUserExists?.isDeleted) {
    throw new AppError(status.FORBIDDEN, "User is Deleted!");
  }

  if (isUserExists?.status === "blocked") {
    throw new AppError(status.FORBIDDEN, "User is Blocked!");
  }
  const isValidPassword = await User.isPasswordMatched(
    payload?.password,
    isUserExists?.password
  );

  if (!isValidPassword) {
    throw new AppError(status.FORBIDDEN, "Password did not matched!");
  }
  const jwtPayload = { userId: isUserExists?.id, role: isUserExists?.role };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,

    config.jwt_refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: isUserExists?.needPasswordChange,
  };
};

const changePassword = async (user: JwtPayload, payload: TPassword) => {
  const isUserExists = await User.isUserExistsByCustomId(user?.userId);
  if (!isUserExists) {
    throw new AppError(status.NOT_FOUND, "User does not Exists!");
  }

  if (isUserExists?.isDeleted) {
    throw new AppError(status.FORBIDDEN, "User is Deleted!");
  }

  if (isUserExists?.status === "blocked") {
    throw new AppError(status.FORBIDDEN, "User is Blocked!");
  }

  const isValidPassword = await User.isPasswordMatched(
    payload?.oldPassword,
    isUserExists?.password
  );

  if (!isValidPassword) {
    throw new AppError(status.FORBIDDEN, "Password did not matched!");
  }

  const newHashPassword = await bcrypt.hash(
    payload?.newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  await User.findOneAndUpdate(
    {
      id: user.userId,
      role: user.role,
    },
    {
      password: newHashPassword,
      needPasswordChange: false,
      passwordChangedAt: new Date(),
    }
  );
  return null;
};

const refreshToken = async (token: string) => {
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string
  ) as JwtPayload;

  const { userId, iat } = decoded;

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
    User.isValidJWTIssue(isUserExists?.passwordChangedAt as Date, iat as number)
  ) {
    throw new AppError(status.UNAUTHORIZED, "You are not Authorized!");
  }
  const jwtPayload = { userId: isUserExists?.id, role: isUserExists?.role };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );
  return { accessToken };
};

const forgetPassword = async (id: string) => {
  const isUserExists = await User.isUserExistsByCustomId(id);

  if (!isUserExists) {
    throw new AppError(status.NOT_FOUND, "User does not Exists!");
  }

  if (isUserExists?.isDeleted) {
    throw new AppError(status.FORBIDDEN, "User is Deleted!");
  }

  if (isUserExists?.status === "blocked") {
    throw new AppError(status.FORBIDDEN, "User is Blocked!");
  }
  const jwtPayload = { userId: isUserExists?.id, role: isUserExists?.role };
  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    "10m"
  );
  const resetUILink = `${config.front_end_link}?id=${isUserExists?.id}&token=${resetToken}`;
  sendEmail(isUserExists.email, resetUILink);
};

const resetPassword = async (
  payload: { id: string; newPassword: string },
  token: string
) => {
  const isUserExists = await User.isUserExistsByCustomId(payload?.id);

  if (!isUserExists) {
    throw new AppError(status.NOT_FOUND, "User does not Exists!");
  }

  if (isUserExists?.isDeleted) {
    throw new AppError(status.FORBIDDEN, "User is Deleted!");
  }

  if (isUserExists?.status === "blocked") {
    throw new AppError(status.FORBIDDEN, "User is Blocked!");
  }
  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string
  ) as JwtPayload;
  const { userId, role } = decoded;
  if (userId !== payload?.id) {
    throw new AppError(status.FORBIDDEN, "You are forbidden!");
  }
  const newHashPassword = await bcrypt.hash(
    payload?.newPassword,
    Number(config.bcrypt_salt_rounds)
  );
  await User.findOneAndUpdate(
    {
      id: userId,
      role: role,
    },
    {
      password: newHashPassword,
      passwordChangedAt: new Date(),
    }
  );
  return null;
};

export const AuhthServices = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
};
