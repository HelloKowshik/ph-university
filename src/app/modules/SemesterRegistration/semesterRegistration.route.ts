import { Router } from "express";
import validateRequest from "../../middleware/validateRequest";
import { SemesterRegistrationValidations } from "./semesterRegistration.validation";
import { SemesterRegistrationControllers } from "./semesterRegistration.controller";

const router = Router();

router.post(
  "/create-semester-registration",
  validateRequest(
    SemesterRegistrationValidations.createSemesterRegistrationValidationSchema
  ),
  SemesterRegistrationControllers.createSemesterRegistration
);
router.get("/", SemesterRegistrationControllers.getAllSemesterRegistration);
router.get(
  "/:semesterId",
  SemesterRegistrationControllers.getSemesterRegistration
);
router.patch(
  "/:semesterId",
  validateRequest(
    SemesterRegistrationValidations.updateSemesterRegistrationValidationSchema
  ),
  SemesterRegistrationControllers.updateSemesterRegistration
);

router.delete(
  "/:semesterId",
  SemesterRegistrationControllers.deleteSemesterRegistration
);

export const SemesterRegistrationRoutes = router;
