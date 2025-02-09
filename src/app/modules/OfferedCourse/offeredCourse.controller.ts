import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendRespone from "../../utils/sendResponse";
import { OfferedCourseServices } from "./offeredCourse.service";

const createOfferedCourse = catchAsync(async (req, res) => {
  const result = await OfferedCourseServices.createOfferedCourseIntoDB(
    req.body
  );
  sendRespone(res, {
    success: true,
    statusCode: status.OK,
    message: "Offered Course created successfully",
    data: result,
  });
});

const getAllOfferedCourses = catchAsync(async (req, res) => {
  const result = await OfferedCourseServices.getAllOfferedCoursesFromDB(
    req.query
  );
  sendRespone(res, {
    success: true,
    statusCode: status.OK,
    message: "Offered Courses retrived successfully",
    data: result,
  });
});

const getOfferedCourse = catchAsync(async (req, res) => {
  const { offeredId } = req.params;
  const result = await OfferedCourseServices.getSingleOfferedCourseFromDB(
    offeredId
  );
  sendRespone(res, {
    success: true,
    statusCode: status.OK,
    message: "Offered Course retrived successfully",
    data: result,
  });
});

const updateOfferedCourse = catchAsync(async (req, res) => {
  const { offeredId } = req.params;
  const result = await OfferedCourseServices.updateOfferedCourseIntoDB(
    offeredId,
    req.body
  );
  sendRespone(res, {
    success: true,
    statusCode: status.OK,
    message: "Offered Course updated successfully",
    data: result,
  });
});

const deleteOfferedCourse = catchAsync(async (req, res) => {
  const { offeredId } = req.params;
  const result = await OfferedCourseServices.deleteOfferedCourseFromDB(
    offeredId
  );
  sendRespone(res, {
    success: true,
    statusCode: status.OK,
    message: "Offered Course deleted successfully",
    data: result,
  });
});

export const OfferedCourseControllers = {
  createOfferedCourse,
  getAllOfferedCourses,
  getOfferedCourse,
  updateOfferedCourse,
  deleteOfferedCourse,
};
