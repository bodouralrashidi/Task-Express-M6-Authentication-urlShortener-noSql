const JWTStrategy = require("passport-jwt").Strategy;
const { JWT_SECRET, JWT_EXPIRATION_MS } = require("../config/key");
const User = require("../models/User")
const { fromAuthHeaderAsBearerToken } = require("passport-jwt").ExtractJwt;
const bcrypt = require("bcrypt");

const LocalStrategy = require("passport-local").Strategy;

exports.localStrategy = new LocalStrategy(
  { usernameField: "username" },
  async (username, password, done) => {
    try {
      console.log(username ,"backend username")
      const user = await User.findOne({
        username, // equivalent to { name : name }
      });

      const passwordsMatch = user
        ? await bcrypt.compare(password, user.password)
        : false;
      if (passwordsMatch) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      done(error);
    }
  }
);

exports.jwtStrategy = new JWTStrategy(
  {
    jwtFromRequest: fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
  },
  async (jwtPayload, done) => {
    if (Date.now() > jwtPayload.exp) {
      return done(null, false); // this will throw a 401
    }
    try {
      const user = await User.findById(jwtPayload.id);
      if (user)
      {
      done(null, user);}
      else {
        done(null, false);
    }
       // if there is no user, this will throw a 401
    } catch (error) {
      done(error);
    }
  }
);
