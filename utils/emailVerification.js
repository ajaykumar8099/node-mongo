const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const SendEmail = (email, otp) => {
  const options = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Account Verification",
    text: `Your Account verification otp is ${otp}, Please Enter to complete registration.`,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(options, (err, info) => {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};

module.exports = SendEmail;
