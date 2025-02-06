import mongoose from "mongoose";
import { TStudent } from "./student.interface";
import { Student } from "./student.model";
import AppError from "../../errors/AppError";
import status from "http-status";
import { User } from "../User/user.model";

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
  let searchTerm = "";
  const queryObj = { ...query };
  const excludeFields = ["searchTerm", "sort", "limit", "page", "fields"];
  excludeFields.forEach((el) => delete queryObj[el]);
  const studentSearchableFields = [
    "email",
    "name.firstName",
    "name.lastName",
    "presentAddress",
    "permanentAddress",
  ];
  if (query?.searchTerm) {
    searchTerm = query?.searchTerm as string;
  }
  const searchQuery = Student.find({
    $or: studentSearchableFields.map((field) => ({
      [field]: { $regex: searchTerm, $options: "i" },
    })),
  });

  const filterQuery = searchQuery
    .find(queryObj)
    .populate("admissionSemester")
    .populate({
      path: "academicDepartment",
      populate: {
        path: "academicFaculty",
      },
    });

  let sort = (query?.sort ? query?.sort : "-createdAt") as string;
  let skip = 0;
  let page = 1;
  let fields = "-__v";
  if (query?.fields) {
    fields = (query?.fields as string).split(",").join(" ") as string;
  }
  const sortQuery = filterQuery.sort(sort);
  let limit = (query?.limit ? Number(query?.limit) : 1) as number;
  if (query?.page) {
    page = Number(query?.page) as number;
    skip = (page - 1) * limit;
  }
  const paginateQuery = sortQuery.skip(skip);
  const limitQuery = paginateQuery.limit(limit);
  const fieldLimitQuery = await limitQuery.select(fields);
  return fieldLimitQuery;
};

const getSingleStudentFromDB = async (id: string) => {
  const result = await Student.findOne({ id })
    .populate("admissionSemester")
    .populate({
      path: "academicDepartment",
      populate: {
        path: "academicFaculty",
      },
    });
  return result;
};

const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
  const { name, guardianInfo, localGuardian, ...remainingStudentData } =
    payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingStudentData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  if (guardianInfo && Object.keys(guardianInfo).length) {
    for (const [key, value] of Object.entries(guardianInfo)) {
      modifiedUpdatedData[`guardianInfo.${key}`] = value;
    }
  }

  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdatedData[`localGuardian.${key}`] = value;
    }
  }

  const result = await Student.findOneAndUpdate({ id }, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteStudentFromDB = async (id: string) => {
  const session = await mongoose.startSession();
  if (!(await Student.isUserExists(id))) {
    throw new AppError(status.NOT_FOUND, "Student does not exists!");
  }
  try {
    session.startTransaction();
    const deletedStudent = await Student.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session }
    );

    if (!deletedStudent) {
      throw new AppError(status.BAD_REQUEST, "Failed to delete student");
    }

    // get user _id from deletedStudent
    const userId = deletedStudent.id;

    const deletedUser = await User.findOneAndUpdate(
      { id: userId },
      { isDeleted: true },
      { new: true, session }
    );

    if (!deletedUser) {
      throw new AppError(status.BAD_REQUEST, "Failed to delete user");
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedStudent;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error("Failed to delete student");
  }
};

export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
  updateStudentIntoDB,
};
