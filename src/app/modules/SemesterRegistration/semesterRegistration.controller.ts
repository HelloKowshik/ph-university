import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { SemesterRegistrationServices } from "./semesterRegistration.service";

const createSemesterRegistration = catchAsync(async (req, res) => {
  const result =
    await SemesterRegistrationServices.createSemesterRegistrationIntoDB(
      req.body
    );
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Semester Registration created successfully",
    data: result,
  });
});

const getAllSemesterRegistration = catchAsync(async (req, res) => {
  const query = req.query;
  const result =
    await SemesterRegistrationServices.getAllSemesterRegistrationFromDB(query);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Semester Registrations retrived successfully",
    data: result,
  });
});

const getSemesterRegistration = catchAsync(async (req, res) => {
  const { semesterId } = req.params;
  const result =
    await SemesterRegistrationServices.getSingleSemesterRegistrationFromDB(
      semesterId
    );
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Semester Registration retrived successfully",
    data: result,
  });
});

const updateSemesterRegistration = catchAsync(async (req, res) => {
  const { semesterId } = req.params;
  const result =
    await SemesterRegistrationServices.updateSemesterRegistrationIntoDB(
      semesterId,
      req.body
    );
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Semester Registration updated successfully",
    data: result,
  });
});

const deleteSemesterRegistration = catchAsync(async (req, res) => {
  const { semesterId } = req.params;
  const result =
    await SemesterRegistrationServices.deleteSemesterRegistrationFromDB(
      semesterId
    );
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Semester Registration deleted successfully",
    data: result,
  });
});

export const SemesterRegistrationControllers = {
  createSemesterRegistration,
  getAllSemesterRegistration,
  getSemesterRegistration,
  updateSemesterRegistration,
  deleteSemesterRegistration,
};
