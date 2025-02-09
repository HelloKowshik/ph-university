import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendRespone from "../../utils/sendResponse";
import { CourseServices } from "./course.service";

const createCourse = catchAsync(async (req, res) => {
  const result = await CourseServices.createCourseIntoDB(req.body);
  sendRespone(res, {
    success: true,
    statusCode: status.OK,
    message: "Course created successfully",
    data: result,
  });
});

const getAllCourses = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await CourseServices.getAllCoursesFromDB(query);
  sendRespone(res, {
    success: true,
    statusCode: status.OK,
    message: "Courses retrived successfully",
    data: result,
  });
});

const getCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseServices.getSingleCourseFromDB(id);
  sendRespone(res, {
    success: true,
    statusCode: status.OK,
    message: "Course retrived successfully",
    data: result,
  });
});

const updateCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseServices.updateCourseIntoDB(id, req.body);
  sendRespone(res, {
    success: true,
    statusCode: status.OK,
    message: "Course updated successfully",
    data: result,
  });
});

const assignFacultiesWithCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const { faculties } = req.body;
  const result = await CourseServices.assignFacultiesWithCourseIntoDB(
    courseId,
    faculties
  );
  sendRespone(res, {
    success: true,
    statusCode: status.OK,
    message: "Faculty with course assigned successfully",
    data: result,
  });
});

const removeFacultiesWithCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const { faculties } = req.body;
  const result = await CourseServices.removeFacultiesWithCourseFromDB(
    courseId,
    faculties
  );
  sendRespone(res, {
    success: true,
    statusCode: status.OK,
    message: "Faculties From course removed successfully",
    data: result,
  });
});

const deleteCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseServices.deleteCourseFromDB(id);
  sendRespone(res, {
    success: true,
    statusCode: status.OK,
    message: "Course deleted successfully",
    data: result,
  });
});

export const CourseControllers = {
  createCourse,
  getAllCourses,
  getCourse,
  updateCourse,
  assignFacultiesWithCourse,
  removeFacultiesWithCourse,
  deleteCourse,
};
