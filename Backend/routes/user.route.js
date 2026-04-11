import express from "express";
import {
  login,
  logout,
  register,
  updateProfile,
  sendOTP,
  verifyOTP,
  completeRegistration,
  forgotPassword,
} from "../controllers/user.controller.js";
import authenticateToken from "../middleware/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").post(logout);
router
  .route("/profile/update")
  .post(authenticateToken, singleUpload, updateProfile);

// OTP Routes
router.route("/send-otp").post(sendOTP);
router.route("/verify-otp").post(verifyOTP);
router.route("/complete-registration").post(singleUpload, completeRegistration);

// Forgot Password Route
router.route("/forgot-password").post(forgotPassword);

export default router;
