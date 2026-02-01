const nodemailer = require('nodemailer');

// const sendMail = async (email, otp) => {
//   // 1. Create transporter inside or outside the function
//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.EMAIL_USER, // Should be contact.preplytics@gmail.com
//       pass: process.env.EMAIL_PASS, // Your 16-character App Password
//     },
//   });

//   // 2. Fix the log (optional, but prevents ReferenceError)
//   console.log(`Attempting to send OTP to: ${email}`);

//   try {
//     await transporter.sendMail({
//   from: `"PulseIQ Auth" <${process.env.EMAIL_USER}>`,
//   to: email,
//   subject: '✨ Your PulseIQ Verification Code',
//   text: `Your OTP is ${otp}. It expires in 5 minutes.`,
//   html: `
//     <div style="background-color: #f0f4f8; padding: 40px 10px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
//       <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
//         <div style="background-color: #1a3a8a; background-image: linear-gradient(135deg, #1a3a8a 0%, #4f46e5 100%); padding: 30px; text-align: center;">
//           <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 1px;">Welcome!</h1>
//           <p style="color: #e0e7ff; margin-top: 10px; font-size: 16px;">We're excited to have you on board.</p>
//         </div>

//         <div style="padding: 30px; text-align: center; color: #334155;">
//           <h2 style="font-size: 20px; margin-bottom: 10px;">Verify Your Identity</h2>
//           <p style="font-size: 16px; line-height: 1.5;">To get started with PulseIQ, please use the secure verification code below:</p>
          
//           <div style="margin: 30px 0;">
//             <span style="display: inline-block; background: #f1f5f9; color: #1e3a8a; font-size: 36px; font-weight: 700; letter-spacing: 8px; padding: 15px 30px; border-radius: 8px; border: 2px dashed #4f46e5;">
//               ${otp}
//             </span>
//           </div>

//           <p style="font-size: 14px; color: #64748b;">This code is valid for <span style="color: #ef4444; font-weight: 600;">5 minutes</span>.</p>
//         </div>

//         <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
//           <p style="font-size: 12px; color: #94a3b8; margin: 0;">
//             If you didn't request this, you can safely ignore this email.
//           </p>
//           <p style="font-size: 12px; color: #94a3b8; margin-top: 5px; font-weight: bold;">
//             Team PulseIQ
//           </p>
//         </div>
//       </div>
//     </div>
//   `,
// });
//     console.log("Email sent successfully!");
//   } catch (error) {
//     console.error("Nodemailer Error:", error);
//     throw error; // Re-throw so your controller can handle the failure
//   }
// };

// // 4. Ensure the export name matches the function name
// module.exports = sendMail;


const sendMail = async (email, otp) => {
  console.log('Environment check:', {
    EMAIL_USER: process.env.EMAIL_USER ? 'Set' : 'Not set',
    NODE_ENV: process.env.NODE_ENV
  });

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    debug: true, // Enable debug output
    logger: true
  });

  // Verify connection
  transporter.verify(function(error, success) {
    if (error) {
      console.log('SMTP connection error:', error);
    } else {
      console.log('SMTP server is ready to take our messages');
    }
  });

  try {
    const info = await transporter.sendMail({
      from: `"PulseIQ Auth" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '✨ Your PulseIQ Verification Code',
      // ... rest of your email content
        text: `Your OTP is ${otp}. It expires in 5 minutes.`,
  html: `
    <div style="background-color: #f0f4f8; padding: 40px 10px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
        <div style="background-color: #1a3a8a; background-image: linear-gradient(135deg, #1a3a8a 0%, #4f46e5 100%); padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 1px;">Welcome!</h1>
          <p style="color: #e0e7ff; margin-top: 10px; font-size: 16px;">We're excited to have you on board.</p>
        </div>

        <div style="padding: 30px; text-align: center; color: #334155;">
          <h2 style="font-size: 20px; margin-bottom: 10px;">Verify Your Identity</h2>
          <p style="font-size: 16px; line-height: 1.5;">To get started with PulseIQ, please use the secure verification code below:</p>
          
          <div style="margin: 30px 0;">
            <span style="display: inline-block; background: #f1f5f9; color: #1e3a8a; font-size: 36px; font-weight: 700; letter-spacing: 8px; padding: 15px 30px; border-radius: 8px; border: 2px dashed #4f46e5;">
              ${otp}
            </span>
          </div>

          <p style="font-size: 14px; color: #64748b;">This code is valid for <span style="color: #ef4444; font-weight: 600;">5 minutes</span>.</p>
        </div>

        <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="font-size: 12px; color: #94a3b8; margin: 0;">
            If you didn't request this, you can safely ignore this email.
          </p>
          <p style="font-size: 12px; color: #94a3b8; margin-top: 5px; font-weight: bold;">
            Team PulseIQ
          </p>
        </div>
      </div>
    </div>
  `,
    });
    
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    
    return info;
  } catch (error) {
    console.error('Full error details:', {
      message: error.message,
      code: error.code,
      command: error.command
    });
    throw error;
  }
};
module.exports = sendMail;