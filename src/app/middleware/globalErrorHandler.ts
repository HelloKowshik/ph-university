import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { TErrorSources } from "../interface/error";
import handleZodError from "../errors/handleZodError";
import config from "../config";
import handleValidationError from "../errors/handleValidationError";
import handleCastError from "../errors/handleCastError";
import handleDuplicateError from "../errors/handleDuplicateError";
import AppError from "../errors/AppError";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Something went wrong!";
  let errorSources: TErrorSources = [
    { path: "", message: "Something Went wrong!" },
  ];

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err?.name === "ValidationError") {
    const validationError = handleValidationError(err);
    statusCode = validationError?.statusCode;
    message = validationError?.message;
    errorSources = validationError?.errorSources;
  } else if (err?.name === "CastError") {
    const castError = handleCastError(err);
    statusCode = castError.statusCode;
    message = castError.message;
    errorSources = castError.errorSources;
  } else if (err?.errorResponse?.code === 11000) {
    const duplicateError = handleDuplicateError(err);
    statusCode = duplicateError.statusCode;
    message = duplicateError.message;
    errorSources = duplicateError.errorSources;
  } else if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err?.message;
    errorSources = [{ path: "", message: err?.message }];
  } else if (err instanceof Error) {
    message = err?.message;
    errorSources = [{ path: "", message: err?.message }];
  }
  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: config.NODE_ENV === "development" ? err?.stack : null,
  });
};

export default globalErrorHandler;
