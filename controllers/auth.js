const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator');

const User = require('../models/user');

const transporter = nodemailer.createTransport(
  sendGridTransport({
    auth: {
      api_key: process.env.SEND_GRID_API_KEY
    }
  })
);

exports.signup = (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(409).send(errors.array()[0].msg);
  }

  return bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      const user = new User({
        method: 'local',
        local: {
          email: email,
          password: hashedPassword
        }
      });

      return user.save();
    })
    .then(result => {
      res.status(200).send('User registered successfully!');
      /**
       * @sendMail : responsible for sending email
       * @argument emailObject
       * - to : [req.body.email]
       * - from: [ADD_YOUR_EMAIL_ADDRESS_HERE]
       * - subject: [YOUR_EMAIL_SUBJECT_MESSAGE_HERE]
       * - html: [ADD_HTML_TEMPLATE_OF_EMAIL_HERE]
       */
      transporter.sendMail(
        {
          to: req.body.email,
          from: 'contact@test.com',
          subject: 'Signup succeeded!',
          html: '<h1>You have signed up successfully!</h1>'
        },
        (err, res) => {
          if (err) {
            console.log(err);
          }
          console.log(res);
        }
      );
    })
    .catch(err => console.log(err));
};
