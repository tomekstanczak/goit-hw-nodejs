const Contact = require("../../models/contacts");

const fetchContacts = () => {
  return Contact.getAll();
};

const fetchUserContacts = (userId) => {
  return Contact.find({ owner: userId });
};

const fetchContact = (id) => {
  return Contact.findById({ _id: id });
};

const addContact = ({ name, email, phone, owner }) => {
  return Contact.create({ name, email, phone, owner });
};
const removeContact = (id) => {
  return Contact.deleteOne({ _id: id });
};

const removeUserContact = ({ id, owner }) => {
  return Contact.deleteOne({ _id: id, owner: owner });
};

const updateContact = ({ id, toUpdate, upsert = false }) => {
  return Contact.findByIdAndUpdate(
    { _id: id },
    { $set: toUpdate },
    { new: true, runValidators: true, strict: "throw", upsert }
  );
};

const updateStatusContact = ({ id, body }) => {
  return Contact.updateOne(
    { _id: id },
    { $set: body },
    { new: true, runValidators: true, strict: "throw" }
  );
};

module.exports = {
  fetchContacts,
  fetchContact,
  addContact,
  removeContact,
  removeUserContact,
  updateContact,
  updateStatusContact,
  fetchUserContacts,
};
