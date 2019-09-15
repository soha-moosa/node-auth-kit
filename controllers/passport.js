const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookTokenStrategy = require('passport-facebook-token');
const GooglePlusTokenStrategy = require('passport-google-plus-token');

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
 * @FacebookTokenStrategy : The Facebook authentication strategy authenticates users using a Facebook
 *                     account and OAuth 2.0 tokens.
 */

passport.use(
  'facebookToken',
  new FacebookTokenStrategy(
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
            fullName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName
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

passport.use(
  'googleToken',
  new GooglePlusTokenStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const user = await User.findOne({ 'google.id': profile.id });
        if (user) {
          return cb(null, user);
        }
        const newUser = new User({
          method: 'google',
          google: {
            id: profile.id,
            email: profile.emails[0].value,
            fullName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName
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
