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
import hasTimeConflict from "./offeredCourse.utils";
import { User } from "../User/user.model";
import { Student } from "../Student/student.model";

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    section,
    faculty,
    days,
    startTime,
    endTime,
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

  const assignedSchedules = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select("days startTime endTime");

  const newSchedule = { days, startTime, endTime };

  if (hasTimeConflict(assignedSchedules, newSchedule)) {
    throw new AppError(
      status.CONFLICT,
      "The faculty is not available at that schedule!"
    );
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
  const meta = await offeredQuery.countTotal();
  return { meta, result };
};

const getSingleOfferedCourseFromDB = async (id: string) => {
  const result = await OfferedCourse.findById(id);
  return result;
};
const updateOfferedCourseIntoDB = async (
  id: string,
  payload: Pick<
    TOfferedCourse,
    "faculty" | "days" | "startTime" | "endTime" | "maxCapacity"
  >
) => {
  const { faculty, days, startTime, endTime } = payload;

  const isOfferedCourseExists = await OfferedCourse.findById(id);
  if (!isOfferedCourseExists) {
    throw new AppError(status.NOT_FOUND, "Offered Course does not Exists!");
  }

  const isFacultyExists = await Faculty.findById(faculty);
  if (!isFacultyExists) {
    throw new AppError(status.NOT_FOUND, "Faculty does not Exists!");
  }

  const semesterRegistration = isOfferedCourseExists?.semesterRegistration;
  const isSemesterExists = await SemesterRegistration.findById(
    semesterRegistration
  );
  if (!isSemesterExists) {
    throw new AppError(
      status.NOT_FOUND,
      "Semester Registration does not Exists!"
    );
  }

  const semesterStatus = isSemesterExists?.status;
  if (semesterStatus !== "UPCOMING") {
    throw new AppError(
      status.BAD_REQUEST,
      `Can not change data of ${isSemesterExists?.status} Semester`
    );
  }

  const assignedSchedules = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select("days startTime endTime");

  const newSchedule = { days, startTime, endTime };

  if (hasTimeConflict(assignedSchedules, newSchedule)) {
    throw new AppError(
      status.CONFLICT,
      "The faculty is not available at that schedule!"
    );
  }

  const result = await OfferedCourse.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

const deleteOfferedCourseFromDB = async (id: string) => {
  const isOfferedCourseExists = await OfferedCourse.findById(id);
  if (!isOfferedCourseExists) {
    throw new AppError(status.NOT_FOUND, "Offered Course does not Exists!");
  }
  const semesterRegistration = isOfferedCourseExists?.semesterRegistration;
  const semesterStatus = await SemesterRegistration.findById(
    semesterRegistration
  ).select("status");

  if (semesterStatus?.status !== "UPCOMING") {
    throw new AppError(
      status.BAD_REQUEST,
      `You Can not delete ${semesterStatus?.status} Semester`
    );
  }
  const result = await OfferedCourse.findByIdAndDelete(id);
  return result;
};

const getMyOfferedCoursesFromDB = async (
  userId: string,
  query: Record<string, unknown>
) => {
  const page = Number(query?.page) || 1;
  const limit = Number(query?.limit) || 10;
  const skip = (page - 1) * limit;

  const [isStudentExists, currentOngoingRegistrationSemester] =
    await Promise.all([
      await Student.findOne({ id: userId }).lean(),
      await SemesterRegistration.findOne({ status: "ONGOING" }).lean(),
    ]);

  if (!isStudentExists) {
    throw new AppError(status.NOT_FOUND, "Student does not exists!");
  }

  if (!currentOngoingRegistrationSemester) {
    throw new AppError(
      status.NOT_FOUND,
      "Registration Semester does not exists!"
    );
  }

  const aggregrationQuery = [
    {
      $match: {
        semesterRegistration: currentOngoingRegistrationSemester?._id,
        academicFaculty: isStudentExists?.academicFaculty,
        academicDepartment: isStudentExists?.academicDepartment,
      },
    },
    {
      $lookup: {
        from: "courses",
        localField: "course",
        foreignField: "_id",
        as: "course",
      },
    },
    {
      $unwind: "$course",
    },
    {
      $lookup: {
        from: "enrolledcourses",
        let: {
          currentOngoingRegistrationSemester:
            currentOngoingRegistrationSemester._id,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: [
                      "$semesterRegistration",
                      "$$currentOngoingRegistrationSemester",
                    ],
                  },
                  {
                    $eq: ["$student", isStudentExists?._id],
                  },
                  {
                    $eq: ["$isEnrolled", true],
                  },
                ],
              },
            },
          },
        ],
        as: "enrolledCourses",
      },
    },
    {
      $lookup: {
        from: "enrolledcourses",
        let: {
          currentStudent: isStudentExists._id,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$student", "$$currentStudent"] },
                  { $eq: ["$isCompleted", true] },
                ],
              },
            },
          },
        ],
        as: "completedCourses",
      },
    },
    {
      $addFields: {
        completedCourseIds: {
          $map: {
            input: "$completedCourses",
            as: "completed",
            in: "$$completed.course",
          },
        },
      },
    },
    {
      $addFields: {
        isPreRequisitesFulfilled: {
          $or: [
            { $eq: ["$course.preRequisiteCourses", []] },
            {
              $setIsSubset: [
                "$course.preRequisiteCourses.course",
                "$completedCourseIds",
              ],
            },
          ],
        },
        isAlreadyEnrolled: {
          $in: [
            "$course._id",
            {
              $map: {
                input: "$enrolledCourses",
                as: "enroll",
                in: "$$enroll.course",
              },
            },
          ],
        },
      },
    },
    {
      $match: { isAlreadyEnrolled: false, isPreRequisitesFulfilled: true },
    },
  ];
  const paginationQuery = [{ $skip: skip }, { $limit: limit }];

  const result = await OfferedCourse.aggregate([
    ...aggregrationQuery,
    ...paginationQuery,
  ]);

  const total = (await OfferedCourse.aggregate(aggregrationQuery)).length;
  const totalPage = Math.ceil(result.length / limit);

  return { meta: { page, limit, total, totalPage }, result };
};

export const OfferedCourseServices = {
  createOfferedCourseIntoDB,
  getAllOfferedCoursesFromDB,
  getSingleOfferedCourseFromDB,
  updateOfferedCourseIntoDB,
  deleteOfferedCourseFromDB,
  getMyOfferedCoursesFromDB,
};
