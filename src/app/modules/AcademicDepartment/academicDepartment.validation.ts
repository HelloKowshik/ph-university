import { z } from "zod";

const createAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Department Name must be string" }),
    academicFaculty: z.string({
      required_error: "Faculty is required",
      invalid_type_error: "Faculty must be string",
    }),
  }),
});

const updateAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Department Name must be string" })
      .optional(),
    academicFaculty: z
      .string({
        required_error: "Faculty is required",
        invalid_type_error: "Faculty must be string",
      })
      .optional(),
  }),
});

export const AcademicDepartmentValidations = {
  createAcademicDepartmentValidationSchema,
  updateAcademicDepartmentValidationSchema,
};
