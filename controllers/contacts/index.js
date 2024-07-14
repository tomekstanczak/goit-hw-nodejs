const {
  fetchContacts,
  fetchContact,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
} = require("./services");

const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await fetchContacts();
    res.status(200).json(contacts);
  } catch (err) {
    next(err);
  }
};

const getContact = async (req, res, next) => {
  try {
    const id = req.params.contactId;

    const foundContact = await fetchContact(id);

    if (foundContact !== null) {
      res.status(200).json({ foundContact });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};

const postContact = async (req, res, next) => {
  const { name, email, phone } = req.body;
  try {
    const newContactsList = await addContact({ name, email, phone });
    res.status(201).json({ newContactsList });
  } catch (err) {
    next(err);
  }
};

const deleteContact = async (req, res, next) => {
  const id = req.params.contactId;
  try {
    await removeContact(id);
    res.status(200).send({ message: "Contact deleted" });
  } catch (err) {
    next(err);
  }
};

const putContact = async (req, res, next) => {
  const id = req.params.contactId;
  try {
    const updatedContact = await updateContact({
      id,
      toUpdate: req.body,
      upsert: true,
    });
    res.status(200).json({ updatedContact });
  } catch (err) {
    next(err);
  }
};

const patchContact = async (req, res, next) => {
  const id = req.params.contactId;
  const favorite = req.body.favorite;

  if (favorite === undefined) {
    return res.status(400).json({ message: "missing field favorite" });
  }

  try {
    const favoriteFieldUpdate = await updateStatusContact({
      id,
      body: req.body,
    });
    if (!favoriteFieldUpdate.matchedCount) {
      return res.status(400).json({ message: "contact do not exist" });
    } else {
      res.status(200).json(favoriteFieldUpdate);
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllContacts,
  getContact,
  postContact,
  deleteContact,
  putContact,
  patchContact,
};
