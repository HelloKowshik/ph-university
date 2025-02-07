import { Model, Types } from "mongoose";

export type TName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

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

export type TAdmin = {
  id: string;
  user: Types.ObjectId;
  name: TName;
  gender: TGender;
  dateOfBirth?: string;
  contactNo: string;
  email: string;
  bloodGroup?: TBloodGroup;
  emergencyContactNo: string;
  presentAddress: string;
  permanentAddress: string;
  profileImg?: string;
  designation: string;
  isDeleted: boolean;
};

export interface AdminModel extends Model<TAdmin> {
  isUserExists(id: string): Promise<TAdmin | null>;
}
