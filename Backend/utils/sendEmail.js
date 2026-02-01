const nodemailer = require('nodemailer');

const sendEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: '"PulseIQ Auth" <noreply.pulseiq@gmail.com>',
    to: email,
    subject: 'Your Verification Code',
    text: `Your OTP is ${otp}. It expires in 5 minutes.`,
  });
};

module.exports = sendEmail;