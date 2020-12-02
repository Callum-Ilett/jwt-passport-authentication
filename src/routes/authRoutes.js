import { Router } from "express";
import passport from "passport";
import AuthController from "../controllers/authController.js";
import authMiddleware from "../middleware/checkAuth.js";
const { checkAuthenticated } = authMiddleware;

const authRouter = Router();

authRouter.post("/register", AuthController.register);
authRouter.post("/login", AuthController.login);
authRouter.get("/logout", checkAuthenticated, AuthController.logout);

authRouter.get(
  "/status",
  checkAuthenticated,
  AuthController.checkAuthenticated
);
authRouter.get(
  "/google",
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
  })
);
authRouter.get(
  "/google/redirect",
  passport.authenticate("google", { session: false }),
  AuthController.socialAuth
);

export default authRouter;
