const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const jwtStrategy = require("./config/jwt.js");

const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "./public")));

jwtStrategy();

const contactsRouter = require("./routes/api/contacts");
const authRouter = require("./routes/users/authUser.js");

app.use("/api/contacts", contactsRouter);
app.use("/api/users", authRouter);
app.use("/api/contacts", contactsRouter);
app.use("/api/users", authRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: err.message,
    });
  }
  res.status(500).json({
    message: err.message || "something broke!",
  });
});

const { DB_HOST: urlDb } = process.env;
const connection = mongoose.connect(urlDb);
connection
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

module.exports = app;
