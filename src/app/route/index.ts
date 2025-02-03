import express from "express";
import app from "../../app";
import { UserRoutes } from "../modules/User/user.route";
import { StudentRoutes } from "../modules/Student/student.route";
import { AcademicSemesterRoutes } from "../modules/AcademicSemester/academicSemester.route";
import { AcademicFacultyRoutes } from "../modules/AcademicFaculty/academicFaculty.route";
import { AcademicDepartmentRoutes } from "../modules/AcademicDepartment/academicDepartment.route";

const router = express.Router();

const routes = [
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/students",
    route: StudentRoutes,
  },
  {
    path: "/academic-semester",
    route: AcademicSemesterRoutes,
  },
  {
    path: "/academic-faculty",
    route: AcademicFacultyRoutes,
  },
  {
    path: "/academic-departments",
    route: AcademicDepartmentRoutes,
  },
];

routes.forEach((route) => router.use(route.path, route.route));

export default router;
