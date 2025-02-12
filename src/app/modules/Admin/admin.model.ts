import { model, Schema } from "mongoose";
import AppError from "../../errors/AppError";
import status from "http-status";
import { AdminModel, TAdmin, TName } from "./admin.interface";

const nameSchema = new Schema<TName>(
  {
    firstName: {
      type: String,
      required: [true, "First Name is required"],
      trim: true,
    },
    middleName: { type: String },
    lastName: {
      type: String,
      required: [true, "Last Name is required"],
      trim: true,
    },
  },
  { _id: false }
);

const adminSchema = new Schema<TAdmin, AdminModel>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: nameSchema, required: true },
    designation: { type: String, required: true },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, "User is must"],
      ref: "User",
    },
    email: { type: String, required: true, unique: true },
    gender: {
      type: String,
      enum: ["Male", "Female", "Others"],
      required: true,
    },
    dateOfBirth: { type: String },
    contactNo: { type: String, required: true },
    emergencyContactNo: { type: String, required: true },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "O-", "O+", "AB+", "AB-"],
    },
    presentAddress: { type: String, required: true },
    permanentAddress: { type: String, required: true },
    profileImg: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { toJSON: { virtuals: true } }
);

adminSchema.virtual("fullName").get(function () {
  return (
    this?.name?.firstName +
    " " +
    this?.name?.middleName +
    " " +
    this?.name?.lastName
  );
});

adminSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

adminSchema.pre("findOne", function (next) {
  this.findOne({ isDeleted: { $ne: true } });
  next();
});

adminSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

adminSchema.pre("findOneAndUpdate", async function (next) {
  const query = this.getQuery();
  const isAdminExists = await Admin.findOne(query);
  if (!isAdminExists) {
    throw new AppError(status.NOT_FOUND, "Admin does not exists!");
  }
  next();
});

adminSchema.statics.isUserExists = async function (id: string) {
  const existingUser = await Admin.findOne({ id });
  return existingUser;
};

export const Admin = model<TAdmin, AdminModel>("Admin", adminSchema);
