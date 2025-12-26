import express from "express";
import {
  fetchMeController,
  getOtherUsersController,
} from "../controllers/userController";

const router = express.Router();

router.get("/me", fetchMeController);
router.get("/", getOtherUsersController);
export default router;
