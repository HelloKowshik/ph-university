import { Router } from "express";
import validateRequest from "../../middleware/validateRequest";
import { EnrolledCourseValidations } from "./enrolledCourse.validation";
import { EnrolledCourseControllers } from "./enrolledCourse.controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../User/user.constant";

const router = Router();

router.post(
  "/create-enrolled-course",
  auth(USER_ROLE.student),
  validateRequest(
    EnrolledCourseValidations.createEnrolledCourseValidationSchema
  ),
  EnrolledCourseControllers.createEnrolledCourse
);

router.get(
  "/",
  auth(USER_ROLE.faculty),
  EnrolledCourseControllers.getAllEnrolledCourses
);

router.get(
  "/my-enrolled-courses",
  auth(USER_ROLE.student),
  EnrolledCourseControllers.getMyEnrolledCourses
);

router.patch(
  "/update-enrolled-course-marks",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
  validateRequest(
    EnrolledCourseValidations.updateEnrolledCourseMarksValidationSchema
  ),
  EnrolledCourseControllers.updateEnrolledCourseMarks
);

export const EnrolledCourseRoutes = router;
