import passport from 'passport';

import User from '../models/user';
import '../controllers/passport';

exports.isUser = (req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      next(new Error(err));
    });
};

export const authenticateFacebookStrategy = passport.authenticate('facebookToken');

export const authenticateGoogleStrategy = passport.authenticate('googleToken');
