const express = require("express");
const {
  getAllContacts,
  getContact,
  postContact,
  deleteContact,
  putContact,
  patchContact,
} = require("../../controllers/contacts/index");
const authMiddleware = require("../../middleware/jwt.js");

const router = express.Router();

router.get("/", authMiddleware, getAllContacts);

router.get("/:contactId", authMiddleware, getContact);

router.post("/", authMiddleware, postContact);

router.delete("/:contactId", authMiddleware, deleteContact);

router.put("/:contactId", authMiddleware, putContact);

router.patch("/:contactId/favorite", authMiddleware, patchContact);

module.exports = router;
