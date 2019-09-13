const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;

const userModel = new Schema({
  method: {
    type: String,
    enum: ['local', 'facebook'],
    required: true
  },
  local: {
    email: {
      type: String
    },
    password: {
      type: String
    }
  },
  facebook: {
    id: String,
    email: String,
    full_name: String,
    first_name: String,
    last_name: String
  }
});

userModel.methods.validPassword = (password, userPassword) => {
  return bcrypt.compareSync(password, userPassword);
};

module.exports = mongoose.model('User', userModel);
