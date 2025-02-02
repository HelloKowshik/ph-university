import { UserServices } from "./user.service";
import sendRespone from "../../utils/sendResponse";
import status from "http-status";
import catchAsync from "../../utils/catchAsync";

const createStudent = catchAsync(async (req, res) => {
  const { password, student } = req.body;
  const result = await UserServices.createStudentIntoDB(password, student);
  sendRespone(res, {
    success: true,
    statusCode: status.OK,
    message: "User created successfully",
    data: result,
  });
});

export const UserControllers = {
  createStudent,
};
