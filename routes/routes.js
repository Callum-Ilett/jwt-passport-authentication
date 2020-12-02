import { Router } from "express";
import authRouter from "./authRoutes.js";

const router = Router();

router.use("/authentication", authRouter);

export default router;
