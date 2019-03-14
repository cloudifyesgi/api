const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//import bcrypt from 'mongoose-bcrypt';
//import timestamps from 'mongoose-timestamp';
//import mongooseStringQuery from 'mongoose-string-query';

const UserSchema = new Schema(
    {
      email: String,
      name: String,
      firstname: String,
      password: String,
      phone_number: String,
      address: String,
      postal: String,
      city: String,
      is_deleted: Boolean,
      rang:Number
    },
    {
        autoCreate: true,
        collection: 'users'
    }
);

var User = mongoose.model('User', UserSchema);

console.log(typeof User);
module.exports = exports = User
