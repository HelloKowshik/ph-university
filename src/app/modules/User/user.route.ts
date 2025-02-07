import express from "express";
import { UserControllers } from "./user.controller";
import validateRequest from "../../middleware/validateRequest";
import { studentValidations } from "../Student/student.validation";
import { FacultyValidations } from "../Faculty/faculty.validation";
import { AdminValidations } from "../Admin/admin.validation";

const router = express.Router();

router.post(
  "/create-student",
  validateRequest(studentValidations.createStudentValidationSchema),
  UserControllers.createStudent
);
router.post(
  "/create-faculty",
  validateRequest(FacultyValidations.createFacultyValidationSchema),
  UserControllers.createFaculty
);
router.post(
  "/create-admin",
  validateRequest(AdminValidations.createAdminValidationSchema),
  UserControllers.createAdmin
);

export const UserRoutes = router;
