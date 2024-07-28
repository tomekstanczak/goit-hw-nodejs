const express = require("express");
const uploadMiddleware = require("../../middleware/multerMiddleware.js");

const {
  signup,
  login,
  logout,
  currentUser,
  avatarUpdate,
  userVerification,
} = require("../../controllers/users/index.js");
const authMiddleware = require("../../middleware/jwt.js");

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", authMiddleware, logout);

router.get("/current", authMiddleware, currentUser);

router.get("/verify/:verificationToken", userVerification);

router.patch(
  "/avatar",
  authMiddleware,
  uploadMiddleware.single("avatar"),
  avatarUpdate
);

module.exports = router;
