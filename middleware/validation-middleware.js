const { body } = require('express-validator');

const User = require('../models/user');

exports.validateSignupEmail = body(
  'email',
  'Please enter a valid e-mail address.'
)
  .isEmail()
  .custom((value, { req }) => {
    return User.findOne({ 'local.email': value }).then(user => {
      if (user) {
        return Promise.reject(
          'E-Mail exists already, please select a different one!'
        );
      }
    });
  })
  .normalizeEmail();

exports.validateLoginEmail = body(
  'email',
  'Please enter a valid e-mail address.'
)
  .isEmail()
  .normalizeEmail();

exports.validatePassword = body(
  'password',
  'Please enter a alphanumeric password and at least 6 characters long.'
)
  .isLength({ min: 6 })
  .isAlphanumeric()
  .trim();

exports.validateConfirmPassword = body('confirmPassword')
  .trim()
  .custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password have to match!');
    }
    return true;
  });
