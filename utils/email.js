const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
const keys = require('../config/keys');
const AppError = require('./appError');

const sendEmail = async (options) => {
  // const msg = {
  //   from: keys.EMAIL,
  //   to: options.email,
  //   subject: options.subject,
  //   text: options.text,
  //   html: options.message
  // };
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
    from: keys.EMAIL,
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });
};

module.exports = sendEmail;
