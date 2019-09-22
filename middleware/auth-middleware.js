const passport = require('passport');

const User = require('../models/user');
require('../controllers/passport');

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

exports.authenticateFacebookStrategy = passport.authenticate('facebookToken');

exports.authenticateGoogleStrategy = passport.authenticate('googleToken');
