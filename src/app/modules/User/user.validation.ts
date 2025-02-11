import { z } from "zod";
import { UserStatus } from "./user.constant";

const userValidationSchema = z.object({
  password: z
    .string()
    .max(15, { message: "Not more than 15 character" })
    .optional(),
});

const changeStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum([...UserStatus] as [string, ...string[]]),
  }),
});

export const UserValidations = {
  userValidationSchema,
  changeStatusValidationSchema,
};
