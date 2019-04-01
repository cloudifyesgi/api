'use strict';
const bcrypt  = require('mongoose-bcrypt');
const bcryptNode = require('bcrypt-nodejs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const schema = new Schema(
    {
        email: {
            type: String,
            lowercase: true,
            trim: true,
            index: true,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true,
            bcrypt: true
        },
        name: {
            type: String,
            trim: true,
            default: ''
        },
        firstname: {
            type: String,
            trim: true,
            default: ''
        },
        phone_number: {
            type: String,
            trim: true,
            default: ''
        },
        address: {
            type: String,
            trim: true,
            default: ''
        },
        postal: {
            type: String,
            trim: true,
            default: ''
        },
        city: {
            type: String,
            trim: true,
            default: ''
        },
        is_deleted: {
            type: Boolean,
            default: false
        },
        rank: {
            type: Number,
            default: 0
        },
        language: {
            type: String,
            trim: true,
            default: 'fr'
        },
        user_group: [{
            type:Schema.Types.ObjectId,
            ref:'UserGroup'
        }],
        belong_user_group: [{
            type:Schema.Types.ObjectId,
            ref:'UserGroup'
        }]
    },
    {
        autoCreate: true,
        collection: 'User'
    }
);

class UserClass {

    constructor() {
    }

    // comparePassword(password) {
    //     return bcryptNode.compareSync(password, this.password);
    // };
}

schema.methods.comparePassword = function (password) {
    return bcryptNode.compareSync(password, this.password);
};

schema.plugin(bcrypt);
schema.loadClass(UserClass);
const User = mongoose.model('User', schema);

module.exports = User;
