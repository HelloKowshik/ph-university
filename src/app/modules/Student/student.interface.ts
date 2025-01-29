import { Model } from "mongoose";

export type TGender = "Male" | "Female" | "Others";
export type TBloodGroup =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "O-"
  | "O+"
  | "AB+"
  | "AB-";

export type TName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export type TGuardian = {
  fatherName: string;
  fatherOccupation: string;
  fatherContactNo: string;
  motherName: string;
  motherOccupation?: string;
  motherContactNo?: string;
};

export type TLocalGuardian = {
  name: string;
  occupation: string;
  contactNo: string;
  address: string;
};

export type TStudent = {
  id: string;
  name: TName;
  email: string;
  gender: TGender;
  dateOfBirth?: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup?: TBloodGroup;
  presentAddress: string;
  permanentAddress: string;
  guardianInfo: TGuardian;
  localGuardian: TLocalGuardian;
  profileImg?: string;
  isActive: "active" | "blocked";
};

export type StudentMethods = {
  isUserExists(id: string): Promise<TStudent | null>;
};

export type StudentModel = Model<
  TStudent,
  Record<string, never>,
  StudentMethods
>;
