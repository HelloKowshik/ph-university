import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { OfferedCourseServices } from "./offeredCourse.service";

const createOfferedCourse = catchAsync(async (req, res) => {
  const result = await OfferedCourseServices.createOfferedCourseIntoDB(
    req.body
  );
  sendResponse(res, {
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
  sendResponse(res, {
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
  sendResponse(res, {
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
  sendResponse(res, {
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
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Offered Course deleted successfully",
    data: result,
  });
});

const myOfferedCourses = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await OfferedCourseServices.getMyOfferedCoursesFromDB(
    userId,
    req.query
  );
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Offered Courses retrived successfully",
    data: result,
  });
});

export const OfferedCourseControllers = {
  createOfferedCourse,
  getAllOfferedCourses,
  getOfferedCourse,
  updateOfferedCourse,
  deleteOfferedCourse,
  myOfferedCourses,
};
