import status from "http-status";
import config from "../../config";
import AppError from "../../errors/AppError";
import { AcademicSemester } from "../AcademicSemester/academicSemester.model";
import { TStudent } from "../Student/student.interface";
import { Student } from "../Student/student.model";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import generateStudentId from "./user.utils";
import mongoose from "mongoose";

const createStudentIntoDB = async (password: string, payload: TStudent) => {
  const user: Partial<TUser> = {};

  user.password = password || (config.default_pass as string);
  user.role = "student";
  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester
  );

  if (!admissionSemester) {
    throw new AppError(status.NOT_FOUND, "Admission Semester Not Found!");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    user.id = await generateStudentId(admissionSemester);
    const newUser = await User.create([user], { session }); //transaction-1
    if (!newUser.length) {
      throw new AppError(status.BAD_REQUEST, "Failed to create new user!");
    }
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;

    const newStudent = await Student.create([payload], { session }); //transaction-2
    if (!newStudent.length) {
      throw new AppError(status.BAD_REQUEST, "Failed to create Student!");
    }
    await session.commitTransaction();
    await session.endSession();
    return newStudent;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

export const UserServices = {
  createStudentIntoDB,
};
