import passport from "passport";
import { Strategy as JWTStrategy } from "passport-jwt";

import User from "../models/user.js";

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  return token;
};

passport.use(
  "jwt",
  new JWTStrategy(
    {
      secretOrKey: process.env.JWT_SECRET_KEY,
      jwtFromRequest: cookieExtractor,
    },
    async (payload, done) => {
      try {
        const user = await User.findById({ _id: payload.sub });

        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        delete user._doc.password;

        return done(null, user, { message: "User is authorised" });
      } catch (error) {
        return done(error);
      }
    }
  )
);

export default passport;
