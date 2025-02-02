import { model, Schema } from "mongoose";
import { TAcademicSemester } from "./academicSemester.interface";
import {
  AcademicSemesterCodes,
  AcademicSemesterNames,
  Months,
} from "./academicSemester.constant";

const academicSemesterSchema = new Schema<TAcademicSemester>(
  {
    name: { type: String, enum: AcademicSemesterNames, required: true },
    year: { type: String, required: true },
    code: { type: String, enum: AcademicSemesterCodes, required: true },
    startMonth: {
      type: String,
      enum: Months,
      required: true,
    },
    endMonth: {
      type: String,
      enum: Months,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

academicSemesterSchema.pre("save", async function (next) {
  const isUserExixts = await AcademicSemester.findOne({
    year: this.year,
    name: this.name,
  });
  if (isUserExixts) {
    throw new Error("Semester Already Exists!");
  }
  next();
});

export const AcademicSemester = model<TAcademicSemester>(
  "AcademicSemester",
  academicSemesterSchema
);
