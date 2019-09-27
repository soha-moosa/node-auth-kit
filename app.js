import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import session from 'express-session';
import connectMongoDBSession from 'connect-mongodb-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth';
import { isUser } from './middleware/auth-middleware';
import User from './models/user';

const app = express();
const MongoDBStore = connectMongoDBSession(session);

const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: 'sessions'
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser(process.env.SECRET));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true },
    store
  })
);

// passport initialization.
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

app.use(isUser);
app.use(authRoutes);

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log(`Connected Successfully to MongoDB!`);
    app.listen(process.env.PORT, () => {
      console.log(`Server Running at PORT ${process.env.PORT}`);
    });
  })
  .catch(err => console.log(`Connection Failed to MongoDB : ${err}`));
