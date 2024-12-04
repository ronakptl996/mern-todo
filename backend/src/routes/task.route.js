import { Router } from "express";
import { add, deleteTask, update } from "../controllers/task.controller.js";

const router = Router();

router.route("/add").post(add);
router.route("/update/:id").patch(update);
router.route("/delete/:id").delete(deleteTask);

export default router;
