import { Router } from "express";
import validateRequest from "../../middleware/validateRequest";
import { AcademicSemesterValidations } from "./academicSemester.validation";
import { AcademicSemesterControllers } from "./academicSemester.controller";

const router = Router();

router.post(
  "/create-academic-semester",
  validateRequest(
    AcademicSemesterValidations.createAcademicSemesterValidationSchema
  ),
  AcademicSemesterControllers.createAcademicSemester
);
router.get("/", AcademicSemesterControllers.getAllAcademicSemesters);
router.get(
  "/:semesterId",
  AcademicSemesterControllers.getSingleAcademicSemester
);
router.patch(
  "/:semesterId",
  validateRequest(
    AcademicSemesterValidations.updateAcademicSemesterValidationSchema
  ),
  AcademicSemesterControllers.updateAcademicSemester
);

export const AcademicSemesterRoutes = router;
