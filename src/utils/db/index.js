const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.Promise = global.Promise;

const connection = mongoose.connect('mongodb+srv://'+process.env.MONGO_USER+':'+process.env.MONGO_PASSWORD+'@'+process.env.MONGO_HOST+'/'+process.env.MONGO_NAME+'?retryWrites=true', { useNewUrlParser: true });
connection
    .then(
        db => {
            console.log("Successfuly logged to database");
            return db;
        }
    );

module.exports =  connection;
