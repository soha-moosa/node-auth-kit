const router = require('express').Router();

const authController = require('../controllers/auth');
const {
  validateSignupEmail,
  validateLoginEmail,
  validatePassword,
  validateConfirmPassword
} = require('../middleware/validation-middleware');

const {
  authenticateFacebookStrategy,
  authenticateGoogleStrategy
} = require('../middleware/auth-middleware');

router.post(
  '/signup',
  [validateSignupEmail, validatePassword, validateConfirmPassword],
  authController.signup
);

router.post(
  '/login',
  [validateLoginEmail, validatePassword],
  authController.login,
  authController.loginSuccess
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

router.post(
  '/google',
  authenticateGoogleStrategy,
  authController.googleLogin,
  (error, req, res) => {
    if (error) {
      return res.status(401).send({
        message: 'Google authentication failed!',
        error
      });
    }
  }
);

module.exports = router;
