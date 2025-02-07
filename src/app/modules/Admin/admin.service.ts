import status from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { adminSearchableFields } from "./admin.constant";
import { TAdmin } from "./admin.interface";
import { Admin } from "./admin.model";
import mongoose from "mongoose";
import { User } from "../User/user.model";

const getAllAdminsFromDB = async (query: Record<string, unknown>) => {
  const adminQuery = new QueryBuilder(Admin.find(), query)
    .search(adminSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await adminQuery.modelQuery;
  return result;
};

const getSingleAdminFromDB = async (id: string) => {
  const result = await Admin.findById(id);
  return result;
};

const updateAdminIntoDB = async (id: string, payload: Partial<TAdmin>) => {
  const { name, ...remainingAdminData } = payload;
  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingAdminData,
  };
  if (!(await Admin.isUserExists(id))) {
    throw new AppError(status.NOT_FOUND, "Admin not found!");
  }
  if (name && Object.keys(name).length) {
    for (let [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }
  const result = await Admin.findOneAndUpdate({ id }, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteAdminFromDB = async (id: string) => {
  const session = await mongoose.startSession();
  if (!(await Admin.isUserExists(id))) {
    throw new AppError(status.NOT_FOUND, "Admin not found!");
  }
  try {
    session.startTransaction();
    const deletedAdmin = await Admin.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session }
    );
    if (!deletedAdmin) {
      throw new AppError(status.BAD_REQUEST, "Failed to delete Admin!");
    }
    const adminId = deletedAdmin?.id;
    const deletedUser = await User.findOneAndUpdate(
      { id: adminId },
      { isDeleted: true },
      { new: true, session }
    );
    await session.commitTransaction();
    await session.endSession();
    return deletedAdmin;
  } catch (err: any) {
    session.abortTransaction();
    session.endSession();
    throw new Error(err);
  }
};

export const AdminServices = {
  getAllAdminsFromDB,
  getSingleAdminFromDB,
  updateAdminIntoDB,
  deleteAdminFromDB,
};
