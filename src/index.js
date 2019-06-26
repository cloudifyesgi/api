'use strict';

require('dotenv').config();
const modeEnv = process.env.MODE_ENV || 'development';
const cloudifySocket = require("./sockets").get();

const mongoConnection = require('./config').mongo_connection;
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const RouterBuilder = require('./routes');
const app = express();
const connection = mongoConnection(modeEnv);
app.use(morgan('dev'));
app.use(cors());

cloudifySocket.run(3000);

setInterval(() => {
    cloudifySocket.clientConnected.forEach((client) => {
        client.emit("seq-num", "hey les amis");
    });
}, 1000);

app.on('close', () => {
    connection.removeAllListeners();
});

RouterBuilder.build(app);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on ${port} ....`));
