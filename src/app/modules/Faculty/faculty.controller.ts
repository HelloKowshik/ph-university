import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { FacultyServices } from "./faculty.service";

const getAllFaculties = catchAsync(async (req, res) => {
  const query = req.query;
  console.log(req.cookies);
  const result = await FacultyServices.getAllFacultiesFromDB(query);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Faculties Data retrive successfully",
    meta: result.meta,
    data: result.result,
  });
});

const getFaculty = catchAsync(async (req, res) => {
  const { facultyId } = req.params;
  const result = await FacultyServices.getSingleFacultyFromDB(facultyId);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Faculty Data retrive successfully",
    data: result,
  });
});

const updateFaculty = catchAsync(async (req, res) => {
  const { facultyId } = req.params;
  const { faculty } = req.body;
  const result = await FacultyServices.updateFacultyIntoDB(facultyId, faculty);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Faculty Data updated successfully",
    data: result,
  });
});

const deleteFaculty = catchAsync(async (req, res) => {
  const { facultyId } = req.params;
  const result = await FacultyServices.deleteFacultyFromDB(facultyId);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Faculty deleted successfully",
    data: result,
  });
});

export const FacultyControllers = {
  getAllFaculties,
  getFaculty,
  updateFaculty,
  deleteFaculty,
};
