const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;

const userModel = new Schema({
  method: {
    type: String,
    enum: ['local'],
    required: true
  },
  local: {
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  }
});

userModel.methods.validPassword = (password, userPassword) => {
  return bcrypt.compareSync(password, userPassword);
};

module.exports = mongoose.model('User', userModel);
