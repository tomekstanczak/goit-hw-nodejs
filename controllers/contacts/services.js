const Contact = require("../../models/contacts");

const fetchContacts = (userId) => {
  return Contact.find({ owner: userId });
};

const fetchContact = ({ id, userId }) => {
  return Contact.findById({ _id: id, owner: userId });
};

const addContact = ({ name, email, phone, owner }) => {
  return Contact.create({ name, email, phone, owner });
};

const removeContact = ({ id, owner }) => {
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
  updateContact,
  updateStatusContact,
};
