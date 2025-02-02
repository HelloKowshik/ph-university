import { z } from "zod";

const userValidationSchema = z.object({
  password: z
    .string()
    .max(15, { message: "Not more than 15 character" })
    .optional(),
});

export const UserValidations = {
  userValidationSchema,
};
