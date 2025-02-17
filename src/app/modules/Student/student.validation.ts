import { z } from "zod";

const createNameValidationSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  middleName: z.string().optional(),
  lastName: z.string().min(1, { message: "Last name is required" }),
});

const createGuardianValidationSchema = z.object({
  fatherName: z.string().min(1, { message: "Father's name is required" }),
  fatherOccupation: z
    .string()
    .min(1, { message: "Father's occupation is required" }),
  fatherContactNo: z
    .string()
    .min(10, { message: "Father's contact number must be at least 10 digits" })
    .max(15, { message: "Father's contact number cannot exceed 15 digits" })
    .refine((val) => /^[0-9]+$/.test(val), {
      message: "Father's contact number must contain only numbers",
    }),
  motherName: z.string().min(1, { message: "Mother's name is required" }),
  motherOccupation: z.string().optional(),
  motherContactNo: z
    .string()
    .optional()
    .refine((val) => !val || /^[0-9]+$/.test(val), {
      message: "Mother's contact number must contain only numbers",
    }),
});

const createLocalGuardianValidationSchema = z.object({
  name: z.string().min(1, { message: "Local guardian's name is required" }),
  occupation: z
    .string()
    .min(1, { message: "Local guardian's occupation is required" }),
  contactNo: z
    .string()
    .min(10, {
      message: "Local guardian's contact number must be at least 10 digits",
    })
    .max(15, {
      message: "Local guardian's contact number cannot exceed 15 digits",
    })
    .refine((val) => /^[0-9]+$/.test(val), {
      message: "Local guardian's contact number must contain only numbers",
    }),
  address: z
    .string()
    .min(1, { message: "Local guardian's address is required" }),
});

const createStudentValidationSchema = z.object({
  body: z.object({
    password: z
      .string()
      .min(5, { message: "Minimum 5 character must" })
      .optional(),
    student: z
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
        guardianInfo: createGuardianValidationSchema,
        localGuardian: createLocalGuardianValidationSchema,
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

const updateGuardianValidationSchema = z.object({
  fatherName: z.string().optional(),
  fatherOccupation: z.string().optional(),
  fatherContactNo: z.string().optional(),
  motherName: z.string().optional(),
  motherOccupation: z.string().optional(),
  motherContactNo: z.string().optional(),
});

const updateLocalGuardianValidationSchema = z.object({
  name: z.string().optional(),
  occupation: z.string().optional(),
  contactNo: z.string().optional(),
  address: z.string().optional(),
});

const updateStudentValidationSchema = z.object({
  body: z.object({
    student: z.object({
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
    guardianInfo: updateGuardianValidationSchema.optional(),
    localGuardian: updateLocalGuardianValidationSchema.optional(),
  }),
});

export const studentValidations = {
  createStudentValidationSchema,
  updateStudentValidationSchema,
};
