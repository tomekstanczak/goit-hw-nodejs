const User = require("../../models/users.js");

const newUserSignup = (email, _id) => {
  return User.findOne({ email }, { _id: 1 }).lean();
};

const userIsLoggingIn = (email) => {
  return User.findOne({ email });
};

module.exports = { newUserSignup, userIsLoggingIn };
