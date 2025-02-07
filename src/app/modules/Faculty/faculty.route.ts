import { Router } from "express";
import { FacultyControllers } from "./faculty.controller";
import { FacultyValidations } from "./faculty.validation";
import validateRequest from "../../middleware/validateRequest";

const router = Router();

router.get("/", FacultyControllers.getAllFaculties);
router.get("/:facultyId", FacultyControllers.getFaculty);
router.patch(
  "/:facultyId",
  validateRequest(FacultyValidations.updateFacultyValidationSchema),
  FacultyControllers.updateFaculty
);
router.delete("/:facultyId", FacultyControllers.deleteFaculty);

export const FacultyRoutes = router;
