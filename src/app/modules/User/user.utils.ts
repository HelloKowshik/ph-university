import { TAcademicSemester } from "../AcademicSemester/academicSemester.interface";
import { User } from "./user.model";

const findLastStudentId = async () => {
  const lastStudent = await User.findOne({ role: "student" }, { _id: 0, id: 1 })
    .sort({ createdAt: -1 })
    .lean();
  return lastStudent?.id ? lastStudent?.id : undefined;
};

const generateStudentId = async (payload: TAcademicSemester) => {
  let currentId = (0).toString();
  const lastStudentId = await findLastStudentId();
  const lastStudentSemesterCode = lastStudentId?.substring(4, 6);
  const lastStudentSemesterYear = lastStudentId?.substring(0, 4);
  const currentSemesterCode = payload?.code;
  const currentSemesterYear = payload?.year;
  if (
    lastStudentId &&
    lastStudentSemesterCode == currentSemesterCode &&
    lastStudentSemesterYear == currentSemesterYear
  ) {
    currentId = lastStudentId.substring(6);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");
  incrementId = `${payload.year}${payload.code}${incrementId}`;
  return incrementId;
};

// Faculty ID
export const findLastFacultyId = async () => {
  const lastFaculty = await User.findOne(
    {
      role: "faculty",
    },
    {
      id: 1,
      _id: 0,
    }
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastFaculty?.id ? lastFaculty.id.substring(2) : undefined;
};

export const generateFacultyId = async () => {
  let currentId = (0).toString();
  const lastFacultyId = await findLastFacultyId();

  if (lastFacultyId) {
    currentId = lastFacultyId.substring(2);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");

  incrementId = `F-${incrementId}`;

  return incrementId;
};

export const findLastAdminId = async () => {
  const lastAdminId = await User.findOne({ role: "admin" }, { _id: 0, id: 1 })
    .sort({ createdAt: -1 })
    .lean();
  return lastAdminId?.id ? lastAdminId.id : undefined;
};

export const generateAdminId = async () => {
  let currentId = (0).toString();
  const lastAdminId = await findLastAdminId();
  if (lastAdminId) {
    currentId = lastAdminId.substring(2);
  }
  let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");
  incrementId = `A-${incrementId}`;
  return incrementId;
};

export default generateStudentId;
