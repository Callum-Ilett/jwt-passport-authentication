import passport from "passport";
import jwt from "jsonwebtoken";
import PassportLocal from "../config/passport-local.js";
import PassportJWT from "../config/passport-jwt.js";
import PassportGoogle from "../config/passport-google.js";

const createCookieFromToken = (userID, req, res) => {
  const { JWT_SECRET_KEY } = process.env;
  console.log(userID);
  console.log("sign coockie", JWT_SECRET_KEY);

  const options = { iss: "StudentPad", sub: userID };
  const token = jwt.sign(options, JWT_SECRET_KEY, {
    expiresIn: "1h",
  });

  const cookieOptions = {
    expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  };

  res.cookie("jwt", token, cookieOptions);

  res.status(200).json({
    status: "success",
    token,
  });
};

const authController = {
  socialAuth: (req, res) => {
    try {
      const id = req.user._id;
      createCookieFromToken(id, req, res);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  register: (req, res) => {
    passport.authenticate("register", { session: false }, (err, user, info) => {
      try {
        if (err || !user) {
          return res.status(400).send(info.message);
        }

        return res.status(201).json({
          message: "Signup successful",
          user: {
            id: user._id,
            email: user.email,
          },
        });
      } catch (error) {
        return res.status(400).json(error);
      }
    })(req, res);
  },

  login: (req, res) => {
    passport.authenticate("login", { session: false }, (err, user, info) => {
      if (err || !user) {
        return res.status(401).json(info.message);
      }

      createCookieFromToken(user._id, req, res);
    })(req, res);
  },

  logout: (req, res) => {
    res.clearCookie("jwt");
    res.status(200).json({
      status: "success",
      data: {
        message: "Successfully logged out",
      },
    });
  },

  checkAuthenticated: (req, res) => {
    if (req.user) {
      res.status(200).json({ isAuthenticated: true, user: req.user });
    }
  },
};

export default authController;
