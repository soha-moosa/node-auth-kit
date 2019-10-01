import { Router } from 'express';

import * as authController from '../controllers/auth';
import {
  validateSignupEmail,
  validateLoginEmail,
  validatePassword,
  validateConfirmPassword
} from '../middleware/validation-middleware';

import {
  authenticateFacebookStrategy,
  authenticateGoogleStrategy
} from '../middleware/auth-middleware';

const router = Router();

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

export default router;
