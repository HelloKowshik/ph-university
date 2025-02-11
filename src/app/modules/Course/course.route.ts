import { Router } from "express";
import validateRequest from "../../middleware/validateRequest";
import { CourseValidations } from "./course.validation";
import { CourseControllers } from "./course.controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../User/user.constant";

const router = Router();

router.post(
  "/create-course",
  auth(USER_ROLE.admin),
  validateRequest(CourseValidations.createCourseValidationSchema),
  CourseControllers.createCourse
);
router.get("/", CourseControllers.getAllCourses);
router.get("/:id", CourseControllers.getCourse);
router.put(
  "/:courseId/assign-faculties",
  validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
  CourseControllers.assignFacultiesWithCourse
);
router.delete(
  "/:courseId/remove-faculties",
  validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
  CourseControllers.removeFacultiesWithCourse
);
router.patch(
  "/:id",
  auth(USER_ROLE.admin),
  validateRequest(CourseValidations.updateCourseValidationSchema),
  CourseControllers.updateCourse
);
router.delete("/:id", auth(USER_ROLE.admin), CourseControllers.deleteCourse);

export const CourseRoutes = router;
