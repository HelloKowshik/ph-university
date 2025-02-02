import { StudentServices } from "./student.service";
import sendRespone from "../../utils/sendResponse";
import status from "http-status";
import catchAsync from "../../utils/catchAsync";

const getAllStudents = catchAsync(async (req, res) => {
  const result = await StudentServices.getAllStudentsFromDB();
  sendRespone(res, {
    success: true,
    statusCode: status.OK,
    message: "Students Data retrive successfully",
    data: result,
  });
});

const getSingleStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const result = await StudentServices.getSingleStudentFromDB(studentId);
  sendRespone(res, {
    success: true,
    statusCode: status.OK,
    message: "Student Data retrive successfully",
    data: result,
  });
});

const deleteStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const result = await StudentServices.deleteStudentFromDB(studentId);
  sendRespone(res, {
    success: true,
    statusCode: status.OK,
    message: "Student Data deleted successfully",
    data: result,
  });
});

export const StudentControllers = {
  getAllStudents,
  getSingleStudent,
  deleteStudent,
};
