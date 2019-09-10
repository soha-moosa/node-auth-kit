const router = require('express').Router();
const { body } = require('express-validator');

const authController = require('../controllers/auth');
const User = require('../models/user');

router.post(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email address')
      .custom((value, { req }) => {
        return User.findOne({ 'local.email': value }).then(user => {
          if (user) {
            return Promise.reject(
              'E-Mail exists already, please select a different one'
            );
          }
        });
      })
      .normalizeEmail(),
    body(
      'password',
      'Please enter a password with only numbers and alphabets and at least 5 characters'
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body('confirmPassword')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password have to match!');
        }
        return true;
      })
  ],
  authController.signup
);

module.exports = router;
