import express from "express";
import { StudentControllers } from "./student.controller";
import validateRequest from "../../middleware/validateRequest";
import { studentValidations } from "./student.validation";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../User/user.constant";

const router = express.Router();

router.get("/", StudentControllers.getAllStudents);
router.get(
  "/:studentId",
  auth(USER_ROLE.admin, USER_ROLE.faculty),
  StudentControllers.getSingleStudent
);
router.patch(
  "/:studentId",
  validateRequest(studentValidations.updateStudentValidationSchema),
  StudentControllers.updateStudent
);
router.delete("/:studentId", StudentControllers.deleteStudent);

export const StudentRoutes = router;
