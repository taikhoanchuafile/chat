import express from "express";
import {
  refreshTokenController,
  signInController,
  signInGGController,
  signOutController,
  signUpController,
} from "../controllers/authController";
import { validate } from "../middlewares/validateMiddleware";
import {
  signInGGSchema,
  signInSchema,
  signUpSchema,
} from "../schemas/authSchema";

const router = express.Router();

router.post("/signup", validate(signUpSchema), signUpController);
router.post("/signin", validate(signInSchema), signInController);
router.post("/signout", signOutController);
router.post("/refresh-token", refreshTokenController);
router.post("/signingg", validate(signInGGSchema), signInGGController);
export default router;
