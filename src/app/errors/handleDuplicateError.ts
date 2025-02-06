import mongoose from "mongoose";
import { TErrorResponse, TErrorSources } from "../interface/error";

const handleDuplicateError = (err: any): TErrorResponse => {
  const errorSources: TErrorSources = [
    {
      path: err?.errorResponse?.errmsg.split("{")[1].split(":")[0],
      message: err?.errorResponse?.errmsg.split("{")[1].split(":")[1],
    },
  ];
  const statusCode = 400;
  return {
    statusCode,
    message: "Duplicate Error",
    errorSources,
  };
};

export default handleDuplicateError;
