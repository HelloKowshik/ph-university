import { model, Schema } from "mongoose";
import { FacultyModel, TFaculty, TName } from "./faculty.interface";
import AppError from "../../errors/AppError";
import status from "http-status";

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

const facultySchema = new Schema<TFaculty, FacultyModel>(
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
    academicDepartment: {
      type: Schema.Types.ObjectId,
      required: [true, "Academic Department is must"],
      ref: "AcademicDepartment",
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      required: [true, "Academic Faculty is must"],
      ref: "AcademicFaculty",
    },
    profileImg: { type: String, default: "" },
    isDeleted: { type: Boolean, default: false },
  },
  { toJSON: { virtuals: true } }
);

facultySchema.virtual("fullName").get(function () {
  return (
    this?.name?.firstName +
    " " +
    this?.name?.middleName +
    " " +
    this?.name?.lastName
  );
});

facultySchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

facultySchema.pre("findOne", function (next) {
  this.findOne({ isDeleted: { $ne: true } });
  next();
});

facultySchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

facultySchema.pre("findOneAndUpdate", async function (next) {
  const query = this.getQuery();
  const isFacultyExists = await Faculty.findOne(query);
  if (!isFacultyExists) {
    throw new AppError(status.NOT_FOUND, "Faculty does not exists!");
  }
  next();
});

facultySchema.statics.isUserExists = async function (id: string) {
  const existingUser = await Faculty.findOne({ id });
  return existingUser;
};

export const Faculty = model<TFaculty, FacultyModel>("Faculty", facultySchema);
