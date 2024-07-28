const nodemailer = require("nodemailer");
require("dotenv").config();

const { M_USER, M_PASS } = process.env;

const transporter = nodemailer.createTransport({
  host: "smtp.mailgun.org",
  port: 587,
  secure: false,
  auth: {
    user: M_USER,
    pass: M_PASS,
  },
});

async function sendVerificationEmail(to, code) {
  await transporter.sendMail({
    from: "<test@gmail.com>",
    to,
    subject: "Contacts app verification",
    html: `<h1>Welcome</h1><a href="http://localhost:3000/api/users/verify/${code}">Click on the message to finish the verification.</a>`,
  });
}

module.exports = sendVerificationEmail;
