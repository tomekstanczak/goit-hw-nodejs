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

async function sendVerificationEmail(to, html) {
  const info = await transporter.sendMail({
    from: "<test@gmail.com>",
    to,
    subject: "Contacts app verification",
    html,
  });

  console.log("Message sent: %s", info.messageId);
}

module.exports = sendVerificationEmail;
