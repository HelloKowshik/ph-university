export type TLoginUser = {
  id: string;
  password: string;
};

export type TPassword = {
  oldPassword: string;
  newPassword: string;
};

export type TJwtPayload = {
  userId: string;
  role: string;
};
