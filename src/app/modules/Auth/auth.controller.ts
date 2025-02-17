import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuhthServices } from "./auth.service";
import config from "../../config";

const loginUser = catchAsync(async (req, res) => {
  const result = await AuhthServices.loginUser(req.body);
  const { refreshToken, accessToken, needPasswordChange } = result;
  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Log in successfull!",
    data: { accessToken, needPasswordChange },
  });
});

const changePassword = catchAsync(async (req, res) => {
  const { ...passwordData } = req.body;
  const result = await AuhthServices.changePassword(req.user, passwordData);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Password Changed successfull!",
    data: result,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuhthServices.refreshToken(refreshToken);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "accessToken generated successfully!",
    data: result,
  });
});

const forgetPassword = catchAsync(async (req, res) => {
  const { id } = req.body;
  const result = await AuhthServices.forgetPassword(id);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Reset link generated successfully!",
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization;
  const result = await AuhthServices.resetPassword(req.body, token as string);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Password Reset successfully!",
    data: result,
  });
});

export const AuthControllers = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
};
