import nodemailer from "nodemailer";
import config from "../config";

export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: config.NODE_ENV === "production", // true for port 465, false for other ports
    auth: {
      user: config.node_mailer_user,
      pass: config.node_mailer_pass,
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
