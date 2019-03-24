'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
    {
        name:{
            type: String,
            bcrypt: true
        },
        creator:{
            type:Schema.Types.ObjectId,
            ref:'User'
        },
        users: [{
            type:Schema.Types.ObjectId,
            ref:'User'
        }]
    },
    {
        autoCreate: true,
        collection: 'UserGroup'
    }
);

class UserGroupClass {

    constructor() {
    }
}

schema.loadClass(UserGroupClass);
var UserGroup = mongoose.model('UserGroup', schema);

module.exports = UserGroup;
