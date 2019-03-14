const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const connection = mongoose.connect('mongodb://localhost/test_projet_annuel');

connection
    .then(
        db => {
            console.log("Successfuly logged to database")
            return db;
        }
    );

module.exports =  connection;
