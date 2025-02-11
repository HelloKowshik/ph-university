import nodemailer from "nodemailer";
import config from "../config";

export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: config.NODE_ENV === "production", // true for port 465, false for other ports
    auth: {
      user: "hellokowshik@gmail.com",
      pass: "zdlt lcsd sidz rsph",
    },
  });
  // send mail with defined transport object
  await transporter.sendMail({
    from: "hellokowshik@gmail.com", // sender address
    to, // list of receivers
    subject: "Password Reset Link", // Subject line
    text: "Change Your password within 10 minutes", // plain text body
    html,
  });
};
