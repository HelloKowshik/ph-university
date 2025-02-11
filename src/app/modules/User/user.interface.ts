import { Model } from "mongoose";
import { USER_ROLE } from "./user.constant";

type TRole = "superAdmin" | "admin" | "student" | "faculty";
type TStatus = "in-progress" | "blocked";

export type TUser = {
  id: string;
  email: string;
  password: string;
  needPasswordChange: boolean;
  passwordChangedAt?: Date;
  role: TRole;
  status: TStatus;
  isDeleted: boolean;
};

export type TUserRole = keyof typeof USER_ROLE;

export interface UserModel extends Model<TUser> {
  isUserExistsByCustomId(id: string): Promise<TUser | null>;
  isPasswordMatched(plainText: string, hash: string): Promise<boolean>;
  isValidJWTIssue(
    passwordChangeTimeStamp: Date,
    jwtIssuedTimeStamp: number
  ): boolean;
}
