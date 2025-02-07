import { Router } from "express";
import validateRequest from "../../middleware/validateRequest";
import { AdminControllers } from "./admin.controller";
import { AdminValidations } from "./admin.validation";

const router = Router();

router.get("/", AdminControllers.getAllAdmins);
router.get("/:adminId", AdminControllers.getAdmin);
router.patch(
  "/:adminId",
  validateRequest(AdminValidations.updateAdminValidationSchema),
  AdminControllers.updateAdmin
);
router.delete("/:adminId", AdminControllers.deleteAdmin);

export const AdminRoutes = router;
