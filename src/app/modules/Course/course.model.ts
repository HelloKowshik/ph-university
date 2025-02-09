import { model, Schema } from "mongoose";
import {
  CourseModel,
  TCourse,
  TCourseFaculty,
  TPreRequisiteCourses,
} from "./course.interface";

const preRequisiteCourseSchema = new Schema<TPreRequisiteCourses>(
  {
    course: { type: Schema.Types.ObjectId, ref: "Course" },
    isDeleted: { type: Boolean, default: false },
  },
  { _id: false }
);

const courseSchema = new Schema<TCourse, CourseModel>(
  {
    title: { type: String, required: true, unique: true, trim: true },
    prefix: { type: String, required: true, trim: true },
    code: { type: Number, required: true },
    credits: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false },
    preRequisiteCourses: [preRequisiteCourseSchema],
  },
  { timestamps: true }
);

const courseFacultySchema = new Schema<TCourseFaculty>(
  {
    course: { type: Schema.Types.ObjectId, ref: "Course", unique: true },
    faculties: [{ type: Schema.Types.ObjectId, ref: "Faculty" }],
  },
  { timestamps: true }
);

courseSchema.pre(
  ["find", "findOne", "findById"] as unknown as "find",
  function (next) {
    this.where({ isDeleted: false });
    next();
  }
);

courseSchema.statics.isCourseExists = async function (id: string) {
  const isExists = await Course.findById(id);
  return isExists;
};

export const Course = model<TCourse, CourseModel>("Course", courseSchema);

export const CourseFaculty = model<TCourseFaculty>(
  "CourseFaculty",
  courseFacultySchema
);
