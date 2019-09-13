const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const sendMail = require('../services/sendGrid');
require('./passport');

const signToken = user => {
  return jwt.sign(
    {
      iss: user._id,
      sub: process.env.JWT_SUBJECT,
      iat: new Date().getTime(),
      expiresIn: '1 day'
    },
    process.env.SECRET
  );
};

exports.signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(409).send(errors.array()[0].msg);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    if (hashedPassword) {
      const newUser = new User({
        method: 'local',
        local: {
          email: email,
          password: hashedPassword
        }
      });
      const user = await newUser.save();
      const token = signToken(user);
      sendMail(req.body.email, res);
      return res.status(200).send({
        token,
        message: 'User registered successfully!'
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(404).send(validationErrors.array()[0].msg);
    }
    await passport.authenticate('local', (err, user, info) => {
      if (err) return res.status(404).send(err);
      if (user) {
        req.session.user = user;
        return req.session.save(err => {
          if (err) return res.status(404).send(err);
          const token = signToken(req.user);
          res.status(200).send({
            token,
            message: 'Logged in successfully!'
          });
        });
      } else {
        return res.status(401).send(info);
      }
    })(req, res, next);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.facebookLogin = async (req, res) => {
  try {
    if (req.user.err) {
      return res.status(401).send({
        message: 'Facebook authentication failed!',
        error
      });
    } else if (req.user) {
      req.session.user = req.user;
      return req.session.save(err => {
        if (err) return res.status(404).send(err);
        const token = signToken(req.user);
        return res.status(200).send({
          token,
          message: 'Logged in successfully via facebook!'
        });
      });
    } else {
      return res.status(401).send({
        message: 'Facebook authentication failed!'
      });
    }
  } catch (error) {
    res.status(500).send(err);
  }
};
