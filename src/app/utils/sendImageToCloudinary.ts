import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import fs from "fs";
import { promisify } from "util";
import config from "../config";

const unlinkAsync = promisify(fs.unlink);
export const sendImageToCloudinary = async (
  path: string,
  imageName: string
) => {
  cloudinary.config({
    cloud_name: config.cloudinary_cloud_name,
    api_key: config.cloudinary_api_key,
    api_secret: config.cloudinary_api_secret,
  });

  try {
    const uploadResult = await cloudinary.uploader.upload(path, {
      public_id: imageName,
    });
    await unlinkAsync(path);
    // console.log(`File ${path} deleted successfully.`);
    //   console.log(uploadResult);
    return uploadResult;
  } catch (err: any) {
    throw new Error(err);
  }

  // Upload an image
  // const uploadResult = await cloudinary.uploader
  //   .upload(path, {
  //     public_id: imageName,
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
  // await unlinkAsync(path);
  // console.log(`File ${path} deleted successfully.`);
  //   console.log(uploadResult);
  // return uploadResult;
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + "/uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });
