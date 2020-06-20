const nodemailer = require('nodemailer');
const keys = require('../config/keys');

const sendEmail = (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: keys.EMAIL,
      pass: keys.EMAIL_PASSWORD
    }
    // Activate in gmail "less secure app" option
  });

  // 2) Define the email options
  const mailOptions = {
    to: keys.EMAIL,
    from: keys.EMAIL,
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  };

  // 3) Actually send the email
};
