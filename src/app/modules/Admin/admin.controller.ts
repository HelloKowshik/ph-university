import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AdminServices } from "./admin.service";

const getAllAdmins = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await AdminServices.getAllAdminsFromDB(query);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Admins Data retrived successfully",
    data: result,
  });
});

const getAdmin = catchAsync(async (req, res) => {
  const { adminId } = req.params;
  const result = await AdminServices.getSingleAdminFromDB(adminId);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Admin Data retrived successfully",
    data: result,
  });
});

const updateAdmin = catchAsync(async (req, res) => {
  const { adminId } = req.params;
  const { admin } = req.body;
  const result = await AdminServices.updateAdminIntoDB(adminId, admin);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Admin Data updated successfully",
    data: result,
  });
});

const deleteAdmin = catchAsync(async (req, res) => {
  const { adminId } = req.params;
  const result = await AdminServices.deleteAdminFromDB(adminId);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Admin Data deleted successfully",
    data: result,
  });
});

export const AdminControllers = {
  getAllAdmins,
  getAdmin,
  updateAdmin,
  deleteAdmin,
};
