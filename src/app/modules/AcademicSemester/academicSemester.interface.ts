import { Model } from "mongoose";

export type TSemesterName = "Autumn" | "Summar" | "Fall";
export type TSemesterCoode = "01" | "02" | "03";
export type TMonth =
  | "January"
  | "February"
  | "March"
  | "April"
  | "May"
  | "June"
  | "July"
  | "August"
  | "September"
  | "October"
  | "November"
  | "December";

export type TAcademicSemester = {
  name: TSemesterName;
  year: string;
  code: TSemesterCoode;
  startMonth: TMonth;
  endMonth: TMonth;
};

export type TAcademicSemesterCodeMapper = {
  [key: string]: string;
};
