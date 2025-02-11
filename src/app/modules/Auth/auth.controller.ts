import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendRespone from "../../utils/sendResponse";
import { AuhthServices } from "./auth.service";
import config from "../../config";

const loginUser = catchAsync(async (req, res) => {
  const result = await AuhthServices.loginUser(req.body);
  const { refreshToken, accessToken, needPasswordChange } = result;
  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
  });
  sendRespone(res, {
    success: true,
    statusCode: status.OK,
    message: "Log in successfull!",
    data: { accessToken, needPasswordChange },
  });
});

const changePassword = catchAsync(async (req, res) => {
  const { ...passwordData } = req.body;
  const result = await AuhthServices.changePassword(req.user, passwordData);
  sendRespone(res, {
    success: true,
    statusCode: status.OK,
    message: "Password Changed successfull!",
    data: result,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuhthServices.refreshToken(refreshToken);
  sendRespone(res, {
    success: true,
    statusCode: status.OK,
    message: "accessToken generated successfully!",
    data: result,
  });
});

const forgetPassword = catchAsync(async (req, res) => {
  const { id } = req.body;
  const result = await AuhthServices.forgetPassword(id);
  sendRespone(res, {
    success: true,
    statusCode: status.OK,
    message: "Reset link generated successfully!",
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization;
  const result = await AuhthServices.resetPassword(req.body, token as string);
  sendRespone(res, {
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
