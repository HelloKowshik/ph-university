import Joi from "joi";

const nameValidationSchema = Joi.object({
  firstName: Joi.string().min(3).required(),
  middleName: Joi.string().min(5).optional(),
  lastName: Joi.string().min(3).required(),
});

const guardianInfoValidationSchema = Joi.object({
  fatherName: Joi.string().required(),
  fatherOccupation: Joi.string().required(),
  fatherContactNo: Joi.string().required(),
  motherName: Joi.string().required(),
  motherOccupation: Joi.string().optional(),
  motherContactNo: Joi.string().optional(),
});

const localGuardianValidationSchema = Joi.object({
  name: Joi.string().required(),
  occupation: Joi.string().required(),
  contactNo: Joi.string().required(),
  address: Joi.string().required(),
});

const studentValidationSchema = Joi.object({
  id: Joi.string(),
  name: nameValidationSchema.required(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  gender: Joi.string()
    .required()
    .valid("Male", "Female", "Others")
    .messages({ "any.only": "{#value} must be Male/Female/Others" }),
  dateOfBirth: Joi.string().required(),
  contactNo: Joi.string().min(11).max(11).required(),
  emergencyContactNo: Joi.string().min(11).max(11).required(),
  bloodGroup: Joi.string()
    .required()
    .valid("A+", "A-", "B+", "B-", "O-", "O+", "AB+", "AB-")
    .messages({ "any.only": "{#value} must be specified" }),
  presentAddress: Joi.string().required(),
  permanentAddress: Joi.string().required(),
  guardianInfo: guardianInfoValidationSchema.required(),
  localGuardian: localGuardianValidationSchema.required(),
  profileImg: Joi.string(),
  isActive: Joi.string()
    .required()
    .valid("active", "blocked")
    .default("active"),
});

export default studentValidationSchema;
