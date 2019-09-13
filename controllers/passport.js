const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook-token');

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

/**
 * @FacebookStrategy : The Facebook authentication strategy authenticates users using a Facebook
 *                     account and OAuth 2.0 tokens.
 */

passport.use(
  'facebook',
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const user = await User.findOne({ 'facebook.id': profile.id });
        if (user) {
          return cb(null, user);
        }
        const newUser = new User({
          method: 'facebook',
          facebook: {
            id: profile.id,
            email: profile.emails[0].value,
            full_name: profile.displayName,
            first_name: profile.name.givenName,
            last_name: profile.name.familyName
          }
        });
        await newUser.save();
        cb(null, newUser);
      } catch (err) {
        cb(err, false, err.message);
      }
    }
  )
);
