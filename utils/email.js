const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
const keys = require('../config/keys');
const AppError = require('./appError');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: '587',
    secureConnection: false,
    secure: false,
    requireTLS: true,
    auth: {
      user: keys.EMAIL_AUTH_USER,
      pass: keys.EMAIL_AUTH_PASSWORD
    },
    tls: {
      ciphers: 'SSLv3'
    }
  });

  const mailOptions = {
    from: keys.EMAIL, // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: options.text, // plain text body
    html: options.message // html body
  };

  // transporter.sendMail(mailOptions, function (err, info) {
  //   if (err) {
  //     new AppError(err, 503);
  //   } else {
  //     console.log(`Email sent: ${info.response}`);
  //   }
  // });
  try {
    const { response } = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${response}`);
  } catch (err) {
    throw new AppError(err, 503);
  }
};

module.exports = sendEmail;
