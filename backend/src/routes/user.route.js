import { Router } from "express";
import {
  registerHandler,
  loginHandler,
  getUserDetails,
  logoutHandler,
} from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(verifyJwt, getUserDetails);
router.route("/login").post(loginHandler);
router.route("/register").post(registerHandler);
router.route("/logout").post(verifyJwt, logoutHandler);

export default router;
