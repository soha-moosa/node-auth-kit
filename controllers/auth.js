import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import passport from 'passport';
import jwt from 'jsonwebtoken';

import User from '../models/user';
import sendMail from '../services/sendGrid';
import './passport';

const signToken = user => {
  return jwt.sign(
    {
      iss: user._id,
      sub: process.env.JWT_SUBJECT,
      iat: new Date().getTime(),
      expiresIn: '1 day'
    },
    process.env.SECRET
  );
};

export const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(409).send(errors.array()[0].msg);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    if (hashedPassword) {
      const newUser = new User({
        method: 'local',
        local: {
          email: email,
          password: hashedPassword
        }
      });
      const user = await newUser.save();
      const token = signToken(user);
      sendMail(req.body.email, res);
      return res.status(200).send({
        token,
        message: 'User registered successfully!'
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(404).send(validationErrors.array()[0].msg);
    } else {
      await passport.authenticate('local')(req, res, next);
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

export const loginSuccess = (req, res, next) => {
  const token = signToken(req.user);
  return res.status(200).send({
    token,
    message: 'Logged in successfully!'
  });
};

export const facebookLogin = async (req, res) => {
  try {
    const { user } = req;
    if (user.err) {
      return res.status(401).send({
        message: 'Facebook authentication failed!',
        error: user.err
      });
    } else if (user) {
      const token = signToken(user);
      return res.status(200).send({
        token,
        message: 'Logged in successfully via facebook!'
      });
    } else {
      return res.status(401).send({
        message: 'Facebook authentication failed!'
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { user } = req;
    if (user.err) {
      return res.status(401).send({
        message: 'Google authentication failed!',
        error
      });
    } else if (user) {
      const token = signToken(user);
      return res.status(200).send({
        token,
        message: 'Logged in successfully via google!'
      });
    } else {
      return res.status(401).send({
        message: 'Google authentication failed!'
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
};
