import { Router } from "express";
import {
  add,
  deleteTask,
  update,
  getTask,
} from "../controllers/task.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").post(verifyJwt, getTask);
router.route("/add").post(verifyJwt, add);
router.route("/update").patch(verifyJwt, update);
router.route("/delete/:id").delete(verifyJwt, deleteTask);

export default router;
