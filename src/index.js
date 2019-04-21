'use strict';

require('dotenv').config();
const modeEnv = process.env.MODE_ENV || 'development';

// const Rollbar = require("rollbar");
// const rollbar = new Rollbar({
//     accessToken: 'd3f9e301c7664fb98c08f8ff95663dd6',
//     captureUncaught: true,
//     captureUnhandledRejections: true
// });

const mongoConnection = require('./config').mongo_connection;
const express = require('express');
const morgan = require('morgan');

const RouterBuilder = require('./routes');
const app = express();
// app.use(rollbar.errorHandler());
const connection = mongoConnection(modeEnv);
app.use(morgan('dev'));

app.get('/', (req, res, next) => {
    res.send('Shengapi start !').end();
});

app.on('close', () => {
    connection.removeAllListeners();
});

RouterBuilder.build(app);


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on ${port} ....`));
