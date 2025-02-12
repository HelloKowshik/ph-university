import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendRespone from "../../utils/sendResponse";
import { EnrolledCourseServices } from "./enrolledCourse.service";

const createEnrolledCourse = catchAsync(async (req, res) => {
  const result = await EnrolledCourseServices.createEnrolledCourseIntoDB(
    req.body
  );
  sendRespone(res, {
    success: true,
    statusCode: status.OK,
    message: "Student enrolled successfully",
    data: result,
  });
});

export const EnrolledCourseControllers = {
  createEnrolledCourse,
};
