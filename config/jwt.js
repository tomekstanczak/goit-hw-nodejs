const passport = require("passport");
const passportJWT = require("passport-jwt");
const { User } = require("../models/users.js");

const ExtractJwt = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;

function setJWTStrategy() {
  const secret = "alkjadlfjaADFa534lkadflj";
  const params = {
    secretOrKey: secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  };
  passport.use(
    new JWTStrategy(params, async function (payload, done) {
      try {
        const user = await User.findOne({ _id: payload.id });
        if (!user) {
          return done(new Error("User not found."));
        }
        return done(null, user);
      } catch (e) {
        return done(e);
      }
    })
  );
}

module.exports = setJWTStrategy;
