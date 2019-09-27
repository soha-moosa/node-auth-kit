import { body } from 'express-validator';

import User from '../models/user';

export const validateSignupEmail = body(
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

export const validateLoginEmail = body(
  'email',
  'Please enter a valid e-mail address.'
)
  .isEmail()
  .normalizeEmail();

export const validatePassword = body(
  'password',
  'Please enter a alphanumeric password and at least 6 characters long.'
)
  .isLength({ min: 6 })
  .isAlphanumeric()
  .trim();

export const validateConfirmPassword = body('confirmPassword')
  .trim()
  .custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password have to match!');
    }
    return true;
  });
