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
import { JwtPayload } from "jsonwebtoken";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";
import { AcademicFaculty } from "../AcademicFaculty/academicFaculty.model";

const createStudentIntoDB = async (
  file: any,
  password: string,
  payload: TStudent
) => {
  const user: Partial<TUser> = {};

  user.password = password || (config.default_pass as string);
  user.role = "student";
  user.email = payload?.email;
  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester
  ).lean();

  if (!admissionSemester) {
    throw new AppError(status.NOT_FOUND, "Admission Semester Not Found!");
  }

  const academicDepartment = await AcademicDepartment.findById(
    payload?.academicDepartment
  ).lean();

  if (!academicDepartment) {
    throw new AppError(status.NOT_FOUND, "Academic Department Not Found!");
  }

  payload.academicFaculty = academicDepartment?.academicFaculty;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    user.id = await generateStudentId(admissionSemester);

    if (file) {
      const imageName = `${user.id}-${payload?.name.firstName}`;
      const path = file.path;
      const imageData = await sendImageToCloudinary(path, imageName);
      payload.profileImg = imageData?.secure_url;
    }

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

const createFacultyIntoDB = async (
  file: any,
  password: string,
  payload: TFaculty
) => {
  const user: Partial<TUser> = {};
  user.password = password || (config.default_pass as string);
  user.role = "faculty";
  user.email = payload?.email;
  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment
  ).lean();

  if (!academicDepartment) {
    throw new AppError(status.NOT_FOUND, "Department Not Found!");
  }

  payload.academicFaculty = academicDepartment?.academicFaculty;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    user.id = await generateFacultyId();

    if (file) {
      const imageName = `${user.id}-${payload?.name.firstName}`;
      const path = file.path;
      const imageData = await sendImageToCloudinary(path, imageName);
      payload.profileImg = imageData?.secure_url;
    }

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

const createAdminIntoDB = async (
  file: any,
  password: string,
  payload: TAdmin
) => {
  const user: Partial<TUser> = {};
  user.password = password || (config.default_pass as string);
  user.role = "admin";
  user.email = payload?.email;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    user.id = await generateAdminId();

    if (file) {
      const imageName = `${user.id}-${payload?.name.firstName}`;
      const path = file.path;
      const imageData = await sendImageToCloudinary(path, imageName);
      payload.profileImg = imageData?.secure_url;
    }

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

const getMe = async (payload: JwtPayload) => {
  const { userId, role } = payload;
  let result = null;
  if (role === "student") {
    result = await Student.findOne({ id: userId })
      .populate("admissionSemester")
      .populate({
        path: "academicDepartment",
        populate: {
          path: "academicFaculty",
        },
      });
  }
  if (role === "admin") {
    result = await Admin.findOne({ id: userId }).populate("user");
  }
  if (role === "faculty") {
    result = await Faculty.findOne({ id: userId }).populate("user");
  }
  return result;
};

const changeStatus = async (id: string, payload: { status: string }) => {
  const result = await User.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

export const UserServices = {
  createStudentIntoDB,
  createFacultyIntoDB,
  createAdminIntoDB,
  getMe,
  changeStatus,
};
