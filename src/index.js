'use strict';

require('dotenv').config();
const modeEnv = process.env.MODE_ENV || 'development';
let dbConnection;

if(modeEnv === 'development') {
     dbConnection = require('./utils').db.dev_connection;
} else if(modeEnv === 'production') {
     dbConnection = require('./utils').db.dev_connection;
}

const express = require('express');
const morgan = require('morgan');

const RouterBuilder = require('./routes');
const app = express();
dbConnection();
app.use(morgan('dev'));

app.get('/', (req, res, next) => {
    res.send('Shengapi start !').end();
});
RouterBuilder.build(app);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on ${port} ....`));
