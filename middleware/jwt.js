const passport = require("passport");
const User = require("../models/users.js");

function authMiddleware(req, res, next) {
  passport.authenticate(
    "jwt",
    {
      session: false,
    },
    async (err, user) => {
      if (!user || err) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const dbUser = await User.findById(user._id);
      if (!dbUser || dbUser.token === null) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      res.locals.user = user;
      next();
    }
  )(req, res, next);
}

module.exports = authMiddleware;
