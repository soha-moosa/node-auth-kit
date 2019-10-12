const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const passport = require('passport');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');
const { isUser } = require('./middleware/auth-middleware');
const User = require('./models/user');

const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: 'sessions'
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
