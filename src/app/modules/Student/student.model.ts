import { Schema, model } from "mongoose";
import {
  StudentModel,
  TGuardian,
  TLocalGuardian,
  TName,
  TStudent,
} from "./student.interface";
import bcrypt from "bcrypt";
import config from "../../config";

const nameSchema = new Schema<TName>({
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
});

const guardianInfoSchema = new Schema<TGuardian>({
  fatherName: { type: String, required: true },
  fatherOccupation: { type: String, required: true },
  fatherContactNo: { type: String, required: true },
  motherName: { type: String, required: true },
  motherOccupation: { type: String },
  motherContactNo: { type: String },
});

const localGuardianSchema = new Schema<TLocalGuardian>({
  name: { type: String, required: true },
  occupation: { type: String, required: true },
  contactNo: { type: String, required: true },
  address: { type: String, required: true },
});

const studentSchema = new Schema<TStudent, StudentModel>(
  {
    id: { type: String, unique: true, required: true },
    password: {
      type: String,
      required: true,
      minlength: [5, "Minimum 5 character"],
    },
    name: { type: nameSchema, required: true },
    email: { type: String, required: true, unique: true },
    gender: {
      type: String,
      enum: {
        values: ["Male", "Female", "Others"],
        message: "{VALUE} must be Male/Female/Others",
      },
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
    guardianInfo: { type: guardianInfoSchema, required: true },
    localGuardian: { type: localGuardianSchema, required: true },
    profileImg: { type: String },
    isActive: { type: String, enum: ["active", "blocked"], default: "active" },
    isDeleted: { type: Boolean, default: false },
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

studentSchema.virtual("fullName").get(function () {
  return (
    this.name?.firstName +
    " " +
    this.name?.middleName +
    " " +
    this.name?.lastName
  );
});

studentSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds)
  );
  next();
});

studentSchema.post("save", function (doc, next) {
  doc.password = "";
  next();
});

studentSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

studentSchema.pre("findOne", function (next) {
  this.findOne({ isDeleted: { $ne: true } });
  next();
});

studentSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

studentSchema.statics.isUserExists = async function (id: string) {
  const existingUser = await Student.findOne({ id });
  return existingUser;
};

export const Student = model<TStudent, StudentModel>("Student", studentSchema);
