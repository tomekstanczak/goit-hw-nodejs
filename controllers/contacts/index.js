const {
  fetchContacts,
  fetchUserContacts,
  fetchContact,
  addContact,
  removeContact,
  removeUserContact,
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

const getAllUserContacts = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const contacts = await fetchUserContacts(userId);
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
      res.status(404).json({ message: "Contact do not exist" });
    }
  } catch (err) {
    next(err);
  }
};

const postContact = async (req, res, next) => {
  const owner = req.user._id;
  const { name, email, phone } = req.body;
  console.log(req.body);
  try {
    const newContactsList = await addContact({ name, email, phone, owner });
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

const deleteUserContact = async (req, res, next) => {
  const owner = req.user._id;
  const id = req.params.contactId;
  try {
    await removeUserContact(id, owner);
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
  deleteUserContact,
  putContact,
  patchContact,
  getAllUserContacts,
};
