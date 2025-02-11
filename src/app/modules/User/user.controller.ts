import { UserServices } from "./user.service";
import sendRespone from "../../utils/sendResponse";
import status from "http-status";
import catchAsync from "../../utils/catchAsync";

const createStudent = catchAsync(async (req, res) => {
  const { password, student } = req.body;
  const result = await UserServices.createStudentIntoDB(
    req.file,
    password,
    student
  );
  sendRespone(res, {
    success: true,
    statusCode: status.OK,
    message: "Student created successfully",
    data: result,
  });
});

const createFaculty = catchAsync(async (req, res) => {
  const { password, faculty } = req.body;
  const result = await UserServices.createFacultyIntoDB(password, faculty);
  sendRespone(res, {
    success: true,
    statusCode: status.OK,
    message: "Faculty created successfully",
    data: result,
  });
});

const createAdmin = catchAsync(async (req, res) => {
  const { password, admin } = req.body;
  const result = await UserServices.createAdminIntoDB(password, admin);
  sendRespone(res, {
    success: true,
    statusCode: status.OK,
    message: "Admin created successfully",
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const result = await UserServices.getMe(req.user);
  sendRespone(res, {
    success: true,
    statusCode: status.OK,
    message: "Data retrived successfully",
    data: result,
  });
});

const changeStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserServices.changeStatus(id, req.body);
  sendRespone(res, {
    success: true,
    statusCode: status.OK,
    message: "Status changes successfully",
    data: result,
  });
});

export const UserControllers = {
  createStudent,
  createFaculty,
  createAdmin,
  getMe,
  changeStatus,
};
