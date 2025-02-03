import { model, Schema } from "mongoose";
import { TAcademicSemester } from "./academicSemester.interface";
import {
  AcademicSemesterCodes,
  AcademicSemesterNames,
  Months,
} from "./academicSemester.constant";
import AppError from "../../errors/AppError";
import status from "http-status";

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
  const isSemesterExists = await AcademicSemester.findOne({
    year: this.year,
    name: this.name,
  });
  if (isSemesterExists) {
    throw new AppError(status.BAD_REQUEST, "Semester Already Exists!");
  }
  next();
});

academicSemesterSchema.pre("findOneAndUpdate", async function (next) {
  const query = this.getQuery();
  const isSemesterExists = await AcademicSemester.findById(query);
  if (!isSemesterExists) {
    throw new AppError(status.NOT_FOUND, "Semester does not Exists!");
  }
  next();
});

export const AcademicSemester = model<TAcademicSemester>(
  "AcademicSemester",
  academicSemesterSchema
);
