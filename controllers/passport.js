const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

/**
 * @LocalStrategy : Local authentication strategy authenticates users using email and password
 */

passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ 'local.email': email });
        if (!user)
          return done(null, false, { error: 'Invalid e-Mail or password!' });
        const userPassword = user.local.password;
        if (!user.validPassword(password, userPassword)) {
          return done(null, false, { error: 'Invalid e-mail or password!' });
        }
        return done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);
