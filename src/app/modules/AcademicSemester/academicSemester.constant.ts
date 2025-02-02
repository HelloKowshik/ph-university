import {
  TAcademicSemesterCodeMapper,
  TMonth,
  TSemesterCoode,
  TSemesterName,
} from "./academicSemester.interface";

export const Months: TMonth[] = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const AcademicSemesterNames: TSemesterName[] = [
  "Autumn",
  "Summar",
  "Fall",
];
export const AcademicSemesterCodes: TSemesterCoode[] = ["01", "02", "03"];

export const semesterCodeMapper: TAcademicSemesterCodeMapper = {
  Autumn: "01",
  Summar: "02",
  Fall: "03",
};
