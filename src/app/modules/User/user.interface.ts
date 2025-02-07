type TRole = "admin" | "student" | "faculty";
type TStatus = "in-progress" | "blocked";

export type TUser = {
  id: string;
  password: string;
  needPasswordChange: boolean;
  role: TRole;
  status: TStatus;
  isDeleted: boolean;
};
