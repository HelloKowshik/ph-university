import { z } from "zod";

const createNameValidationSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  middleName: z.string().optional(),
  lastName: z.string().min(1, { message: "Last name is required" }),
});

const createFacultyValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20),
    faculty: z
      .object({
        name: createNameValidationSchema,
        email: z.string().email({ message: "Invalid email format" }),
        gender: z.enum(["Male", "Female", "Others"], {
          errorMap: () => ({
            message: "Gender must be Male, Female, or Others",
          }),
        }),
        dateOfBirth: z.string().optional(),
        contactNo: z
          .string()
          .min(11, { message: "Contact number must be at least 11 digits" })
          .max(11, { message: "Contact number cannot exceed 11 digits" })
          .refine((val) => /^[0-9]+$/.test(val), {
            message: "Contact number must contain only numbers",
          }),
        emergencyContactNo: z
          .string()
          .min(11, {
            message: "Emergency contact number must be at least 10 digits",
          })
          .max(15, {
            message: "Emergency contact number cannot exceed 11 digits",
          })
          .refine((val) => /^[0-9]+$/.test(val), {
            message: "Emergency contact number must contain only numbers",
          }),
        bloodGroup: z
          .enum(["A+", "A-", "B+", "B-", "O-", "O+", "AB+", "AB-"])
          .optional(),
        presentAddress: z
          .string()
          .min(1, { message: "Present address is required" }),
        permanentAddress: z
          .string()
          .min(1, { message: "Permanent address is required" }),
        designation: z.string(),
        academicDepartment: z.string(),
        profileImg: z
          .string()
          .url({ message: "Invalid URL format" })
          .optional(),
      })
      .refine((data) => data.contactNo !== data.emergencyContactNo, {
        message:
          "Emergency contact number must be different from the primary contact number",
        path: ["emergencyContactNo"],
      }),
  }),
});

const updateNameValidationSchema = z.object({
  firstName: z.string().optional(),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
});

const updateFacultyValidationSchema = z.object({
  body: z.object({
    faculty: z.object({
      name: updateNameValidationSchema.optional(),
      email: z.string().optional(),
      gender: z.enum(["Male", "Female", "Others"]).optional(),
    }),
    dateOfBirth: z.string().optional(),
    contactNo: z.string().optional(),
    emergencyContactNo: z.string().optional(),
    bloodGroup: z
      .enum(["A+", "A-", "B+", "B-", "O-", "O+", "AB+", "AB-"])
      .optional(),
    presentAddress: z.string().optional(),
    permanentAddress: z.string().optional(),
    academicDepartment: z.string().optional(),
    profileImg: z.string().optional(),
    designation: z.string().optional(),
  }),
});

export const FacultyValidations = {
  createFacultyValidationSchema,
  updateFacultyValidationSchema,
};
