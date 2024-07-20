const express = require("express");
const {
  getAllContacts,
  getContact,
  postContact,
  deleteContact,
  putContact,
  patchContact,
} = require("../../controllers/contacts/index");

const router = express.Router();

router.get("/", getAllContacts);

router.get("/:contactId", getContact);

router.post("/", postContact);

router.delete("/:contactId", deleteContact);

router.put("/:contactId", putContact);

router.patch("/:contactId/favorite", patchContact);

module.exports = router;
