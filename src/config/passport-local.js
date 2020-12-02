import passport from "passport";
import { Strategy as localStrategy } from "passport-local";

import User from "../models/user.js";

passport.use(
  "register",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const checkEmail = await User.checkExistingField("email", email);

        if (checkEmail) {
          return done(null, false, {
            message: "Email already registered",
          });
        }

        const user = await User.create({ email, password });
        return done(null, user, { message: "Successfully Created" });
      } catch (error) {
        return done(null, false, { message: error.message });
      }
    }
  )
);

passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        const validate = await user.isValidPassword(password);

        if (!validate) {
          return done(null, false, { message: "Incorrect Password" });
        }

        return done(null, user, { message: "Logged in Successfully" });
      } catch (error) {
        return done(error);
      }
    }
  )
);

export default passport;
