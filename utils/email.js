const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const keys = require('../config/keys');
const AppError = require('./appError');

const sendEmail = async (options) => {
  // 1) Create a transporterOptions
  const transporterOptions = {
    auth: {
      api_key: keys.SENDGRID_API_KEY
    }
  };
  const client = nodemailer.createTransport(sgTransport(transporterOptions));

  // 2) Define the email options
  const mailOptions = {
    from: keys.EMAIL,
    to: options.email,
    subject: options.subject,
    text: options.text,
    html: '<strong>and easy to do anywhere, even with Node.js</strong>'
  };

  // 3) Actually send the email
  try {
    await client.sendMail(mailOptions);
    console.log('WORKING!!!!!');
  } catch (err) {
    new AppError('Email could not be sent', 503);
  }
};

module.exports = sendEmail;
