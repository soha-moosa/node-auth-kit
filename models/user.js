const mongoose = require('mongoose');

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

module.exports = mongoose.model('User', userModel);
