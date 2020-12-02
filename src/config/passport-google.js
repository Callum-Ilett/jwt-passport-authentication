import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";

import User from "../models/user.js";

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, CALLBACK_URL } = process.env;

const passportConfig = {
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: `${CALLBACK_URL}/google/redirect`,
};

passport.use(
  "google",
  new GoogleStrategy(
    passportConfig,
    async (accessToken, refreshToken, profile, done) => {
      const newUser = {
        googleID: profile.id,
        displayName: profile.displayName,
        name: profile.name.givenName,
        email: profile._json.email,
        image: profile._json.picture,
      };

      try {
        const currentUser = await User.findOne({ googleId: newUser.googleID });
        if (currentUser) {
          return done(null, currentUser, { statusCode: 200 });
        }

        const checkEmail = await User.checkExistingField(
          "email",
          newUser.email
        );
        if (checkEmail) {
          const user = await User.findByIdAndUpdate(
            checkEmail._id,
            { googleId: newUser.googleID },
            { new: true }
          );
          return done(null, user, { statusCode: 200 });
        }

        const userObj = new User(newUser);

        const user = await userObj.save({ validateBeforeSave: false });

        return done(null, user, { statusCode: 201 });
      } catch (err) {
        done(err, false);
      }
    }
  )
);

export default passport;
