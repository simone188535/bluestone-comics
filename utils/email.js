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
    html: '<strong>and easy to do anywhere, even with Node.js</strong>'
  };
  sgMail.send(msg);

  // 3) Actually send the email
  //   try {
//   await client.sendMail(mailOptions, function (err, res) {
//     if (err) {
//       console.log(err);
//     }
//     console.log(res);
//   });
//   console.log('WORKING!!!!!');
  //   } catch (err) {
  //     new AppError('Email could not be sent', 503);
  //   }
};

module.exports = sendEmail;
