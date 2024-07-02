const express = require("express");
const fs = require("fs/promises");
const path = require("path");
const Joi = require("joi");

const router = express.Router();

const pathContacts = path.join(__dirname, "../../db/contacts.json");

const contactSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(9).required(),
});
const putSchema = Joi.object({
  name: Joi.string().min(3),
  email: Joi.string().email(),
  phone: Joi.string().min(9),
});

async function listContacts() {
  const data = await fs.readFile(pathContacts, "utf8");
  return JSON.parse(data);
}

function getById(contactsList, id) {
  const foundContact = contactsList.find((contact) => contact.id === id);
  if (foundContact) {
    return foundContact;
  } else {
    return null;
  }
}

async function addContact(contacts, name, email, phone) {
  try {
    const id = `${contacts.length + 1}`;

    const newContact = {
      id,
      name,
      email,
      phone,
    };

    contacts.push(newContact);

    await fs.writeFile(pathContacts, JSON.stringify(contacts, null, 1));
    return contacts;
  } catch (e) {
    console.log(e);
  }
}

async function removeContact(contacts, id) {
  const contactExists = contacts.some((contact) => contact.id === id);
  if (!contactExists) {
    return null;
  } else {
    const newContacts = contacts.filter((task) => task.id !== id);
    contacts = [...newContacts];
    await fs.writeFile(pathContacts, JSON.stringify(contacts, null, 1));
    return contacts;
  }
}

async function updateContact(id, name, email, phone, contacts) {
  const contactIndex = contacts.findIndex((contact) => contact.id === id);
  if (contactIndex === null) {
    return null;
  }
  const existingContact = contacts[contactIndex];
  const updatedContact = {
    ...existingContact,
    name: name || existingContact.name,
    email: email || existingContact.email,
    phone: phone || existingContact.phone,
  };

  contacts[contactIndex] = updatedContact;

  await fs.writeFile(pathContacts, JSON.stringify(contacts, null, 2));
  return updatedContact;
}

router.get("/", async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.status(200).json({ contacts });
  } catch (err) {
    console.log(err);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const id = req.params.contactId;

    const contactsList = await listContacts();
    const foundContact = getById(contactsList, id);

    if (foundContact !== null) {
      res.status(200).json({ foundContact });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/", async (req, res, next) => {
  const { error } = contactSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { name, email, phone } = req.body;
  const contacts = await listContacts();
  const newContactsList = await addContact(contacts, name, email, phone);

  res.status(201).json({ newContactsList });
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const contacts = await listContacts();
    const id = req.params.contactId;
    const updatedContacts = await removeContact(contacts, id);
    if (updatedContacts === null) {
      res.status(404).json({ message: "contact not found" });
    } else {
      res.status(200).json({ message: "contact deleted" });
    }
  } catch (err) {
    console.log(err);
  }
});

router.put("/:contactId", async (req, res, next) => {
  const { error } = putSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const { name, email, phone } = req.body;
    const id = req.params.contactId;
    const contacts = await listContacts();

    const updatedContact = await updateContact(
      id,
      name,
      email,
      phone,
      contacts
    );

    if (updatedContact) {
      res.status(200).json({ updatedContact });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
