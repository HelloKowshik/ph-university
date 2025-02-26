import { Router } from "express";
import { FacultyControllers } from "./faculty.controller";
import { FacultyValidations } from "./faculty.validation";
import validateRequest from "../../middleware/validateRequest";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../User/user.constant";

const router = Router();

router.get(
  "/",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
  FacultyControllers.getAllFaculties
);
router.get(
  "/:facultyId",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
  FacultyControllers.getFaculty
);
router.patch(
  "/:facultyId",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(FacultyValidations.updateFacultyValidationSchema),
  FacultyControllers.updateFaculty
);
router.delete(
  "/:facultyId",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  FacultyControllers.deleteFaculty
);

export const FacultyRoutes = router;
