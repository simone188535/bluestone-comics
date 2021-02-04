const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
const keys = require('../config/keys');
const AppError = require('./appError');

const sendEmail = async (options) => {
  // 1) Create a transporterOptions
  sgMail.setApiKey(keys.SENDGRID_API_KEY);

  const msg = {
    from: keys.EMAIL,
    to: options.email,
    subject: options.subject,
    text: options.text,
    html: options.message
  };

  try {
    // 2) Actually send the email
    await sgMail.send(msg);
    console.log('email sent successfully');
  } catch (err) {
    new AppError('Email could not be sent', 503);
  }
};

module.exports = sendEmail;
