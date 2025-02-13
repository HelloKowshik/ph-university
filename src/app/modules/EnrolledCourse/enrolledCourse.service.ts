import status from "http-status";
import AppError from "../../errors/AppError";
import { OfferedCourse } from "../OfferedCourse/offeredCourse.model";
import { TEnrolledCourse } from "./enrolledCourse.interface";
import { Student } from "../Student/student.model";
import { EnrolledCourse } from "./enrolledCourse.model";
import mongoose from "mongoose";
import { SemesterRegistration } from "../SemesterRegistration/semesterRegistration.model";
import { Course } from "../Course/course.model";
import { Faculty } from "../Faculty/faculty.model";

const createEnrolledCourseIntoDB = async (
  userId: string,
  payload: TEnrolledCourse
) => {
  const isOfferedCourseExists = await OfferedCourse.findById(
    payload.offeredCourse
  );

  if (!isOfferedCourseExists) {
    throw new AppError(status.NOT_FOUND, "Offered course not found!");
  }

  const studentData = await Student.findOne({ id: userId }, { _id: 1 });
  const {
    semesterRegistration,
    maxCapacity,
    academicSemester,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
  } = isOfferedCourseExists;

  const semesterRegistrationData = await SemesterRegistration.findById(
    semesterRegistration,
    { _id: 0, maxCredit: 1 }
  );
  // console.log(semesterRegistrationData?.maxCredit);

  if (maxCapacity <= 0) {
    throw new AppError(status.BAD_REQUEST, "Room is full!");
  }

  const isStudentAlreadyEnrolled = await EnrolledCourse.findOne({
    semesterRegistration,
    student: studentData?._id,
    offeredCourse: payload?.offeredCourse,
  });
  const isCourseExists = await Course.findById(course, { _id: 0, credits: 1 });

  if (isStudentAlreadyEnrolled) {
    throw new AppError(status.CONFLICT, "You have already enrolled!");
  }

  const enrolledCourses = await EnrolledCourse.aggregate([
    {
      $match: { semesterRegistration, student: studentData?._id },
    },
    {
      $lookup: {
        from: "courses",
        localField: "course",
        foreignField: "_id",
        as: "enrolledCourseData",
      },
    },
    {
      $unwind: "$enrolledCourseData",
    },
    {
      $group: {
        _id: null,
        totalEnrolledCredits: { $sum: "$enrolledCourseData.credits" },
      },
    },
    {
      $project: { _id: 0, totalEnrolledCredits: 1 },
    },
  ]);
  // console.log(enrolledCourses);
  const totalCredits =
    enrolledCourses.length > 0 ? enrolledCourses[0].totalEnrolledCredits : 0;

  if (
    totalCredits &&
    semesterRegistrationData?.maxCredit &&
    totalCredits + isCourseExists?.credits > semesterRegistrationData?.maxCredit
  ) {
    throw new AppError(status.BAD_REQUEST, "Credit Limt exceeds!");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const result = await EnrolledCourse.create(
      [
        {
          semesterRegistration,
          academicSemester,
          academicFaculty,
          academicDepartment,
          isEnrolled: true,
          course,
          offeredCourse: payload?.offeredCourse,
          student: studentData?._id,
          faculty,
        },
      ],
      { session }
    );

    if (!result) {
      throw new AppError(
        status.BAD_REQUEST,
        "Failed to Enroll in this Course!"
      );
    }
    await OfferedCourse.findByIdAndUpdate(payload?.offeredCourse, {
      maxCapacity: maxCapacity - 1,
    });

    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const updateEnrolledCourseMarksIntoDB = async (
  facultyId: string,
  payload: Partial<TEnrolledCourse>
) => {
  const { semesterRegistration, offeredCourse, student, courseMarks } = payload;
  const [
    isSemesterRegistrationExists,
    isOfferedCourseExists,
    isStudentExists,
    isFacultyExists,
  ] = await Promise.all([
    SemesterRegistration.findById(semesterRegistration).lean(),
    OfferedCourse.findById(offeredCourse).lean(),
    Student.findById(student).lean(),
    Faculty.findOne({ id: facultyId }).lean(),
  ]);

  if (
    !isSemesterRegistrationExists ||
    !isOfferedCourseExists ||
    !isStudentExists
  ) {
    throw new AppError(
      status.NOT_FOUND,
      "Semester Registration or Offered Course or Student not Found!"
    );
  }
  const courseFaculty = isFacultyExists?._id;
  const isCourseBelongsToFaculty = await EnrolledCourse.findOne({
    semesterRegistration,
    offeredCourse,
    student,
    faculty: courseFaculty,
  });
  if (!isCourseBelongsToFaculty) {
    throw new AppError(
      status.UNAUTHORIZED,
      "You are not authorized to this course!"
    );
  }

  if (courseMarks?.finalTerm) {
    const { classTest1, midTerm, classTest2, finalTerm } =
      isCourseBelongsToFaculty?.courseMarks;
    const totalMarks =
      Math.ceil(classTest1 * 0.1) +
      Math.ceil(midTerm * 0.3) +
      Math.ceil(classTest2 * 0.1) +
      Math.ceil(finalTerm * 0.5);
  }

  const modifiedData: Record<string, unknown> = { ...courseMarks };
  if (courseMarks && Object.keys(courseMarks).length > 0) {
    for (let [key, value] of Object.entries(courseMarks)) {
      modifiedData[`courseMarks.${key}`] = value;
    }
  }
  const result = await EnrolledCourse.findByIdAndUpdate(
    isCourseBelongsToFaculty?._id,
    modifiedData,
    { new: true }
  );
  return result;
};

export const EnrolledCourseServices = {
  createEnrolledCourseIntoDB,
  updateEnrolledCourseMarksIntoDB,
};
