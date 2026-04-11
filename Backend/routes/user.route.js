import express from "express";
import {
  login,
  logout,
  register,
  updateProfile,
  completeRegistration,
} from "../controllers/user.controller.js";
import authenticateToken from "../middleware/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

// Auth Routes
router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/complete-registration").post(singleUpload, completeRegistration);

// Profile Routes
router
  .route("/profile/update")
  .post(authenticateToken, singleUpload, updateProfile);

export default router;
