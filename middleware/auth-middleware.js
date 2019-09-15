const passport = require('passport');

const User = require('../models/user');
require('../controllers/passport');

exports.isUser = (req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => res.status(500).send(err));
};

exports.authenticateFacebookStrategy = passport.authenticate('facebookToken', {
  session: false
});

exports.authenticateGoogleStrategy = passport.authenticate('googleToken', {
  session: false
});
