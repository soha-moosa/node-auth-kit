const router = require('express').Router();

const authController = require('../controllers/auth');
const {
  validateSignupEmail,
  validateLoginEmail,
  validatePassword,
  validateConfirmPassword
} = require('../middleware/validation-middleware');

const {
  authenticateFacebookStrategy
} = require('../middleware/auth-middleware');

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

router.post(
  '/facebook',
  authenticateFacebookStrategy,
  authController.facebookLogin,
  (error, req, res) => {
    if (error) {
      return res.status(401).send({
        message: 'Facebook authentication failed!',
        error
      });
    }
  }
);

module.exports = router;
