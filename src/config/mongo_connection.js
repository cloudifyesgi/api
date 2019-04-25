'use strict';

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.Promise = global.Promise;

module.exports = async (modeEnv) => {
    let mongoName;
    if(modeEnv === 'development') mongoName = process.env.MONGO_NAME;
    else if(modeEnv === 'test') mongoName = process.env.TEST_MONGO_NAME;
    else if(modeEnv === 'production') mongoName = process.env.PROD_MONGO_NAME;
    else return null;
    const dev_connection = mongoose.connect('mongodb+srv://'+process.env.MONGO_USER+':'+process.env.MONGO_PASSWORD+'@'+process.env.MONGO_HOST+'/'+ mongoName +'?retryWrites=true', { useNewUrlParser: true });
    dev_connection
        .then(
            db => {
                console.log("Successfully logged to database");
                return db;
            }
        );

    return dev_connection;
};
