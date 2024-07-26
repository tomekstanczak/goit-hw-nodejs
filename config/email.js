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

async function email(to, subject, html) {
  const info = await transporter.sendMail({
    from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>',
    to: "stanczaktom.it@gmail.com",
    subject,
    text: "Hello world?",
    html,
  });

  console.log("Message sent: %s", info.messageId);
}

email().catch(console.error);
