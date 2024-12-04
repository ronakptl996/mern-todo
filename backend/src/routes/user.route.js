import { Router } from "express";
import {
  registerHandler,
  loginHandler,
  getUserDetails,
} from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(verifyJwt, getUserDetails);
router.route("/register").post(registerHandler);
router.route("/login").post(loginHandler);

export default router;
