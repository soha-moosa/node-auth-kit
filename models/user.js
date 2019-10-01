import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

const userModel = new Schema({
  method: {
    type: String,
    enum: ['local', 'facebook', 'google'],
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
    fullName: String,
    firstName: String,
    lastName: String
  },
  google: {
    id: String,
    email: String,
    fullName: String,
    firstName: String,
    lastName: String
  }
});

userModel.methods.validPassword = (password, userPassword) => {
  return bcrypt.compareSync(password, userPassword);
};

const User = mongoose.model('User', userModel);

export default User;
