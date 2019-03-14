
const express = require("express");
const bodyParser = require("body-parser");

const api = express();

api.use(bodyParser.urlencoded({ extended: true }));
api.use(bodyParser.json());


api.listen(8080, err => {
    if(err){
        process.exit(1);
    }
     require('./utils/db');

     //require('./routes/user.js')(api);
    require('./routes/')(api);
    /*
     const apiRoutes = require('./routes/user.js');
     api.use('/users',apiRoutes);
*/
     console.log("Cloudify API is currently running ! ");
});

module.exports = api;
