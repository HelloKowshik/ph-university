import status from "http-status";
import AppError from "../../errors/AppError";
import { AcademicSemester } from "../AcademicSemester/academicSemester.model";
import { TSemesterRegistration } from "./semesterRegistration.interface";
import { SemesterRegistration } from "./semesterRegistration.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { registrationSearchableFields } from "./semesterRegistration.constant";

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration
) => {
  const isAcademicSemesterExists = await AcademicSemester.findById(
    payload.academicSemester
  );
  if (!isAcademicSemesterExists) {
    throw new AppError(status.NOT_FOUND, "Academic Semester does not exists!");
  }

  const isAnyCurrentSemesterRegistration = await SemesterRegistration.findOne({
    $or: [{ status: "UPCOMING" }, { status: "ONGOING" }],
  });
  if (isAnyCurrentSemesterRegistration) {
    throw new AppError(
      status.BAD_REQUEST,
      "Already a Semseter Registration Exists!"
    );
  }

  const isSemesterRegistrationExists = await SemesterRegistration.findOne({
    academicSemester: payload.academicSemester,
  });
  if (isSemesterRegistrationExists) {
    throw new AppError(
      status.CONFLICT,
      "Semester Registration Already Registered!"
    );
  }

  const result = await SemesterRegistration.create(payload);
  return result;
};

const getAllSemesterRegistrationFromDB = async (
  query: Record<string, unknown>
) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistration.find().populate("academicSemester"),
    query
  )
    .search(registrationSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await semesterRegistrationQuery.modelQuery;
  return result;
};

const getSingleSemesterRegistrationFromDB = async (id: string) => {
  const result = await SemesterRegistration.findById(id);
  return result;
};

const updateSemesterRegistrationIntoDB = async (
  id: string,
  payload: Partial<TSemesterRegistration>
) => {
  const isRegistrationExists = await SemesterRegistration.findById(id);

  if (!isRegistrationExists) {
    throw new AppError(status.NOT_FOUND, "Semester does not exists!");
  }
  const currentStatus = isRegistrationExists?.status;
  const requestedStatus = payload?.status;

  if (currentStatus === "ENDED") {
    throw new AppError(status.BAD_REQUEST, "Can not update an ENDED Semester!");
  }
  if (
    (currentStatus === "UPCOMING" && requestedStatus === "ENDED") ||
    (currentStatus === "ONGOING" && requestedStatus === "UPCOMING")
  ) {
    throw new AppError(
      status.BAD_REQUEST,
      `You can not change an status from ${currentStatus} to ${requestedStatus}`
    );
  }
  const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

export const SemesterRegistrationServices = {
  createSemesterRegistrationIntoDB,
  getAllSemesterRegistrationFromDB,
  getSingleSemesterRegistrationFromDB,
  updateSemesterRegistrationIntoDB,
};
