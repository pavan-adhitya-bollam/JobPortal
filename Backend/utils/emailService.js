import nodemailer from 'nodemailer';

// Create transporter using Gmail SMTP with proper configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Check if email is properly configured
const isEmailConfigured = () => {
  return !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);
};

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
export const sendOTPEmail = async (email, otp) => {
  try {
    console.log('=== EMAIL SERVICE DEBUG ===');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS configured:', !!process.env.EMAIL_PASS);
    console.log('Sending OTP to:', email);
    console.log('OTP:', otp);
    
    // Verify email configuration first
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error('Email credentials not configured');
    }
    
    // Always try to send the email first
    const mailOptions = {
      from: `"Job Portal" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Job Portal - Email Verification OTP',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 32px;">Job Portal</h1>
            <p style="margin: 10px 0; opacity: 0.9;">Email Verification</p>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 10px; margin-top: 20px;">
            <h2 style="color: #374151; margin-bottom: 20px;">Verify Your Email Address</h2>
            <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
              Thank you for registering with Job Portal! To complete your registration, please use the following OTP (One-Time Password) to verify your email address:
            </p>
            
            <div style="background: white; border: 2px dashed #667eea; padding: 20px; border-radius: 8px; margin: 30px 0; text-align: center;">
              <p style="margin: 0; color: #6b7280; font-size: 14px; margin-bottom: 10px;">Your OTP Code:</p>
              <div style="font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 5px; text-decoration: none;">
                ${otp}
              </div>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
              <strong>Important:</strong>
              <br>· This OTP will expire in <strong>10 minutes</strong>
              <br>· Do not share this OTP with anyone
              <br>· If you didn't request this OTP, please ignore this email
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #9ca3af; font-size: 12px;">
            <p>This is an automated message from Job Portal. Please do not reply to this email.</p>
          </div>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${email}`);
    console.log('Email result:', result);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Email sending failed:', error.message);
    console.log(`OTP for ${email}: ${otp} (check console for OTP)`);
    return { success: false, message: error.message, otp: otp };
  }
};

// Generate and send OTP
export const generateAndSendOTP = async (email) => {
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
  
  const emailResult = await sendOTPEmail(email, otp);
  
  if (emailResult.success) {
    return { otp, expiresAt };
  } else {
    // Still return OTP data even if email fails, so registration can continue
    console.log('Email failed but continuing with OTP generation');
    return { otp, expiresAt };
  }
};

// Send job application confirmation email
export const sendJobApplicationEmail = async (userEmail, userName, jobTitle, companyName) => {
  try {
    console.log('🔧 Email Debug - Environment variables:');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set' : 'Not set');
    console.log('isEmailConfigured():', isEmailConfigured());
    
    // Check if email is properly configured
    if (!isEmailConfigured()) {
      console.log('Email not configured - using test mode');
      console.log(`Test application confirmation for ${userName}: Applied for ${jobTitle} at ${companyName}`);
      return true;
    }

    const mailOptions = {
      from: 'job-portal@ethereal.email',
      to: userEmail,
      subject: `Job Portal - Application Confirmation for ${jobTitle} at ${companyName}`,
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 32px;">Job Portal</h1>
            <p style="margin: 10px 0; opacity: 0.9;">Application Confirmation</p>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 10px; margin-top: 20px;">
            <h2 style="color: #374151; margin-bottom: 20px;">Dear ${userName},</h2>
            <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
              Thank you for applying for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>. 
              We have successfully received your application and resume.
            </p>
            
            <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
              Our team will review your resume and profile carefully. Once we complete our review process, 
              we will inform you about the next steps in the hiring process.
            </p>
            
            <div style="background: white; border: 2px dashed #667eea; padding: 20px; border-radius: 8px; margin: 30px 0; text-align: center;">
              <p style="margin: 0; color: #6b7280; font-size: 14px; margin-bottom: 10px;">Application Details:</p>
              <div style="font-size: 16px; color: #374151;">
                <p><strong>Position:</strong> ${jobTitle}</p>
                <p><strong>Company:</strong> ${companyName}</p>
                <p><strong>Status:</strong> Under Review</p>
              </div>
            </div>
            
            <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
              <strong>Important:</strong>
              <br>• Keep your contact information updated in your profile
              <br>• We will contact you via email regarding next steps
              <br>• This confirmation serves as receipt of your application
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #9ca3af; font-size: 12px;">
            <p>This is an automated message from Job Portal. Please do not reply to this email.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Application confirmation email sent to ${userEmail} for ${jobTitle} at ${companyName}`);
    return true;
  } catch (error) {
    console.error('SMTP connection failed for application email - using fallback:', error.message);
    console.log(`Fallback: Application confirmed for ${userName} - ${jobTitle} at ${companyName}`);
    return true; // Continue even if email fails
  }
};
