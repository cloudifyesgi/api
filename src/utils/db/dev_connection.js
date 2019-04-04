'use strict';

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.Promise = global.Promise;

module.exports = () => {
    const dev_connection = mongoose.connect('mongodb+srv://'+process.env.MONGO_USER+':'+process.env.MONGO_PASSWORD+'@'+process.env.MONGO_HOST+'/'+process.env.MONGO_NAME+'?retryWrites=true', { useNewUrlParser: true });
    dev_connection
        .then(
            db => {
                console.log("Successfuly logged to database");
                return db;
            }
        );

    return dev_connection;
}
