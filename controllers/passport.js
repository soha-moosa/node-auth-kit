import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import FacebookTokenStrategy from 'passport-facebook-token';
import GooglePlusTokenStrategy from 'passport-google-plus-token';

import User from '../models/user';

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
        const {
          id,
          displayName,
          name: { givenName, familyName },
          emails
        } = profile;
        const email = emails[0].value;
        const newUser = new User({
          method: 'facebook',
          facebook: {
            id,
            email,
            fullName: displayName,
            firstName: givenName,
            lastName: familyName
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

/**
 * @GooglePlusTokenStrategy : The Google Plus authentication strategy authenticates users using a
 *                          Google Plus account and OAuth 2.0 tokens.
 */

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
        const {
          id,
          displayName,
          name: { givenName, familyName },
          emails
        } = profile;
        const email = emails[0].value;
        const newUser = new User({
          method: 'google',
          google: {
            id,
            email,
            fullName: displayName,
            firstName: givenName,
            lastName: familyName
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
