import { Schema, model } from "mongoose";
import {
  TGuardian,
  TLocalGuardian,
  TName,
  TStudent,
} from "./student.interface";

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

const studentSchema = new Schema<TStudent>({
  id: { type: String, unique: true },
  name: nameSchema,
  email: { type: String, required: true },
  gender: ["Male", "Female"],
  dateOfBirth: { type: String },
  contactNo: { type: String, required: true },
  emergencyContactNo: { type: String, required: true },
  bloodGroup: ["A+", "A-", "B+", "B-", "O-", "O+", "AB+", "AB-"],
  presentAddress: { type: String, required: true },
  permanentAddress: { type: String, required: true },
  guardianInfo: guardianInfoSchema,
  localGuardian: localGuardianSchema,
  profileImg: { type: String },
  isActive: ["active", "blocked"],
});

export const Student = model<TStudent>("Student", studentSchema);
