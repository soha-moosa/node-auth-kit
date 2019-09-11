const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

/**
 * @LocalStrategy : Local authentication strategy authenticates users using email and password
 */

passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    (email, password, done) => {
      User.findOne({ 'local.email': email }, (err, user) => {
        const userPassword = user.local.password;
        if (err) return done(err);
        if (!user) return done(null, false, { email: 'Invalid E-Mail!' });
        if (!user.validPassword(password, userPassword)) {
          return done(null, false, { password: 'Invalid Password!' });
        }
        return done(null, user);
      });
    }
  )
);
