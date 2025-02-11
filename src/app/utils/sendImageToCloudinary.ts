import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

export const sendImageToCloudinary = async (
  path: string,
  imageName: string
) => {
  cloudinary.config({
    cloud_name: "dqilp3bge",
    api_key: "555767335784257",
    api_secret: "dDYejptosDmIcrkzEEMOfSr9Frg",
  });

  // Upload an image
  const uploadResult = await cloudinary.uploader
    .upload(path, {
      public_id: imageName,
    })
    .catch((error) => {
      console.log(error);
    });

  //   console.log(uploadResult);
  return uploadResult;
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
