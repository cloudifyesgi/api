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
const server = require('http').createServer(app);
cloudifySocket.run(server);

process.env.FILES_PATH = process.env.FILES_PATH ? process.env.FILES_PATH : './';
process.env.FOLDERS_DOWNLOAD_PATH = process.env.FOLDERS_DOWNLOAD_PATH ? process.env.FOLDERS_DOWNLOAD_PATH : './downloads/';

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
server.listen(port, () => console.log(`Listening on ${port} ....`));
