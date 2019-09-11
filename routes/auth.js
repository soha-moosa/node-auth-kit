const router = require('express').Router();

const authController = require('../controllers/auth');
const {
  validateSignupEmail,
  validateLoginEmail,
  validatePassword,
  validateConfirmPassword
} = require('../middleware/validation-middleware');

router.post(
  '/signup',
  [validateSignupEmail, validatePassword, validateConfirmPassword],
  authController.signup
);

router.post(
  '/login',
  [validateLoginEmail, validatePassword],
  authController.login
);

module.exports = router;
