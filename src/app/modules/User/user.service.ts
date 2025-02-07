import status from "http-status";
import config from "../../config";
import AppError from "../../errors/AppError";
import { AcademicSemester } from "../AcademicSemester/academicSemester.model";
import { TStudent } from "../Student/student.interface";
import { Student } from "../Student/student.model";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import generateStudentId, {
  generateAdminId,
  generateFacultyId,
} from "./user.utils";
import mongoose from "mongoose";
import { TFaculty } from "../Faculty/faculty.interface";
import { AcademicDepartment } from "../AcademicDepartment/academicDepartment.model";
import { Faculty } from "../Faculty/faculty.model";
import { TAdmin } from "../Admin/admin.interface";
import { Admin } from "../Admin/admin.model";

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

const createFacultyIntoDB = async (password: string, payload: TFaculty) => {
  const user: Partial<TUser> = {};
  user.password = password || (config.default_pass as string);
  user.role = "faculty";
  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment
  );
  if (!academicDepartment) {
    throw new AppError(status.NOT_FOUND, "Department Not Found!");
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    user.id = await generateFacultyId();

    const newUser = await User.create([user], { session });
    if (!newUser.length) {
      throw new AppError(status.BAD_REQUEST, "Failed to create new User!");
    }

    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;

    const newFaculty = await Faculty.create([payload], { session });
    if (!newFaculty.length) {
      throw new AppError(status.BAD_REQUEST, "Failed to create Faculty");
    }
    await session.commitTransaction();
    await session.endSession();
    return newFaculty;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const createAdminIntoDB = async (password: string, payload: TAdmin) => {
  const user: Partial<TUser> = {};
  user.password = password || (config.default_pass as string);
  user.role = "admin";
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    user.id = await generateAdminId();
    const newUser = await User.create([user], { session });
    if (!newUser.length) {
      throw new AppError(status.BAD_REQUEST, "Failed to create User");
    }
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;
    const newAdmin = await Admin.create([payload], { session });
    if (!newAdmin.length) {
      throw new AppError(status.BAD_REQUEST, "Failed to create Admin");
    }
    await session.commitTransaction();
    await session.endSession();
    return newAdmin;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

export const UserServices = {
  createStudentIntoDB,
  createFacultyIntoDB,
  createAdminIntoDB,
};
