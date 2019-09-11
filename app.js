const app = require('express')();
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const passport = require('passport');

const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/auth-middleware');

const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: 'sessions'
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store
  })
);

// passport initialization.
app.use(passport.initialize());
app.use(passport.session());

app.use(authMiddleware.isUser);
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
