const express = require("express");

const {
  signup,
  login,
  logout,
  currentUser,
} = require("../../controllers/users/index.js");
const authMiddleware = require("../../middleware/jwt.js");

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", authMiddleware, logout);

router.get("/current", authMiddleware, currentUser);

module.exports = router;
