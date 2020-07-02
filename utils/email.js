const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
const keys = require('../config/keys');
const AppError = require('./appError');

const sendEmail = async (options) => {
  // 1) Create a transporterOptions
  sgMail.setApiKey(keys.SENDGRID_API_KEY);

  const msg = {
    from: keys.EMAIL,
    to: 'simone.anthony1@yahoo.com',
    subject: options.subject,
    text: options.text,
    html: options.message
  };

  // try {
  //   await sgMail.send(msg);
  //   console.log('email sent');
  // } catch (err) {
  //   new AppError('Email could not be sent', 503);
  // }
  sgMail.send(msg).then(
    () => {
      console.log('email sent');
    },
    (error) => {
      console.error(error);

      if (error.response) {
        console.error(error.response.body);
      }
    }
  );
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
