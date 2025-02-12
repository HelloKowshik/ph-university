import express from "express";
import { UserRoutes } from "../modules/User/user.route";
import { StudentRoutes } from "../modules/Student/student.route";
import { AcademicSemesterRoutes } from "../modules/AcademicSemester/academicSemester.route";
import { AcademicFacultyRoutes } from "../modules/AcademicFaculty/academicFaculty.route";
import { AcademicDepartmentRoutes } from "../modules/AcademicDepartment/academicDepartment.route";
import { FacultyRoutes } from "../modules/Faculty/faculty.route";
import { AdminRoutes } from "../modules/Admin/admin.route";
import { CourseRoutes } from "../modules/Course/course.route";
import { SemesterRegistrationRoutes } from "../modules/SemesterRegistration/semesterRegistration.route";
import { OfferedCourseRoutes } from "../modules/OfferedCourse/offeredCourse.route";
import { AuthRoutes } from "../modules/Auth/auth.route";
import { EnrolledCourseRoutes } from "../modules/EnrolledCourse/enrolledCourse.route";

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
  {
    path: "/faculties",
    route: FacultyRoutes,
  },
  {
    path: "/admins",
    route: AdminRoutes,
  },
  {
    path: "/courses",
    route: CourseRoutes,
  },
  {
    path: "/semester-registrations",
    route: SemesterRegistrationRoutes,
  },
  {
    path: "/offered-courses",
    route: OfferedCourseRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/enrolled-courses",
    route: EnrolledCourseRoutes,
  },
];

routes.forEach((route) => router.use(route.path, route.route));

export default router;
