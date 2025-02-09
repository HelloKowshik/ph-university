import status from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { SemesterRegistration } from "../SemesterRegistration/semesterRegistration.model";
import { TOfferedCourse } from "./offeredCourse.interface";
import { OfferedCourse } from "./offeredCourse.model";
import { AcademicFaculty } from "../AcademicFaculty/academicFaculty.model";
import { AcademicDepartment } from "../AcademicDepartment/academicDepartment.model";
import { Course } from "../Course/course.model";
import { Faculty } from "../Faculty/faculty.model";

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    section,
    faculty,
  } = payload;
  const isRegistrationExists = await SemesterRegistration.findById(
    semesterRegistration
  );
  if (!isRegistrationExists) {
    throw new AppError(
      status.NOT_FOUND,
      "Semester Registration does not Exists!"
    );
  }
  const academicSemester = isRegistrationExists?.academicSemester;

  const isAcademicFacultyExists = await AcademicFaculty.findById(
    academicFaculty
  );
  if (!isAcademicFacultyExists) {
    throw new AppError(status.NOT_FOUND, "Academic Faculty does not Exists!");
  }

  const isDepartmentExists = await AcademicDepartment.findById(
    academicDepartment
  );
  if (!isDepartmentExists) {
    throw new AppError(
      status.NOT_FOUND,
      "Academic Department does not Exists!"
    );
  }

  const facultyFromDepartment = await AcademicDepartment.findOne({
    _id: academicDepartment,
    academicFaculty,
  });

  if (!facultyFromDepartment) {
    throw new AppError(
      status.BAD_REQUEST,
      "Departmetn does not belong to the specified Faculty"
    );
  }

  const isSectionExists = await OfferedCourse.findOne({
    semesterRegistration,
    course,
    section,
  });
  if (isSectionExists) {
    throw new AppError(
      status.BAD_REQUEST,
      "Same course can not be offered in the same Section with same Semester!"
    );
  }

  const isCourseExists = await Course.findById(course);
  if (!isCourseExists) {
    throw new AppError(status.NOT_FOUND, "Course does not Exists!");
  }

  const isFacultyExists = await Faculty.findById(faculty);
  if (!isFacultyExists) {
    throw new AppError(status.NOT_FOUND, "Faculty does not Exists!");
  }

  const result = await OfferedCourse.create({ ...payload, academicSemester });
  return result;
};

const getAllOfferedCoursesFromDB = async (query: Record<string, unknown>) => {
  const offeredQuery = new QueryBuilder(OfferedCourse.find(), query)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await offeredQuery.modelQuery;
  return result;
};

const getSingleOfferedCourseFromDB = async (id: string) => {};
const updateOfferedCourseIntoDB = async (
  id: string,
  payload: Partial<TOfferedCourse>
) => {};
const deleteOfferedCourseFromDB = async (id: string) => {};

export const OfferedCourseServices = {
  createOfferedCourseIntoDB,
  getAllOfferedCoursesFromDB,
  getSingleOfferedCourseFromDB,
  updateOfferedCourseIntoDB,
  deleteOfferedCourseFromDB,
};
