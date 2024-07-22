const express = require("express");
const {
  getAllContacts,
  getContact,
  postContact,
  deleteContact,
  deleteUserContact,
  putContact,
  patchContact,
  getAllUserContacts,
} = require("../../controllers/contacts/index");
const authMiddleware = require("../../middleware/jwt.js");

const router = express.Router();

router.get("/", getAllContacts);

router.get("/user", authMiddleware, getAllUserContacts);

router.get("/:contactId", getContact);

router.post("/", authMiddleware, postContact);

router.delete("/:contactId", deleteContact);

router.delete("/user/:contactId", authMiddleware, deleteUserContact);

router.put("/:contactId", putContact);

router.patch("/:contactId/favorite", patchContact);

module.exports = router;
