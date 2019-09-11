const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
require('./passport');

const signToken = user => {
  jwt.sign(
    {
      iss: process.env.ISSUER,
      sub: process.env.JWT_SUBJECT,
      iat: new Date().getTime(),
      expiresIn: '1 day'
    },
    process.env.SECRET
  );
};

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

exports.login = (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return res.status(404).send(validationErrors.array()[0].msg);
  }
  passport.authenticate('local', (err, user, info) => {
    if (err) return res.status(404).send(err);
    if (user) {
      req.session.user = user;
      return req.session.save(err => {
        if (err) return res.status(404).send(err);
        const token = signToken(req.user);
        res.status(200).send({
          token,
          _id: user._id,
          email: user.local.email
        });
      });
    } else {
      return res.status(401).send(info);
    }
  })(req, res, next);
};
