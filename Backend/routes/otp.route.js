import express from 'express';
import { sendOTP, verifyOTPController, forgotPassword, resetPassword } from '../controllers/otp.controller.js';
import { sendOTPEmail } from '../services/otpService.js';

const router = express.Router();

// GET /api/auth/test-email
router.get('/test-email', async (req, res) => {
  try {
    const testEmail = process.env.EMAIL_USER;
    if (!testEmail) {
      return res.status(500).json({
        success: false,
        message: 'EMAIL_USER not configured'
      });
    }

    const testOTP = '123456';
    const emailSent = await sendOTPEmail(testEmail, testOTP);
    
    if (emailSent) {
      return res.status(200).json({
        success: true,
        message: 'Test email sent successfully'
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Failed to send test email'
      });
    }
  } catch (error) {
    console.error('Test email error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// POST /api/auth/send-otp
router.post('/send-otp', sendOTP);

// POST /api/auth/verify-otp
router.post('/verify-otp', verifyOTPController);

// POST /api/auth/forgot-password
router.post('/forgot-password', forgotPassword);

// POST /api/auth/reset-password
router.post('/reset-password', resetPassword);

export default router;
