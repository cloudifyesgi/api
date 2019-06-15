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
const fs = require('fs');

const RouterBuilder = require('./routes');
const app = express();
// app.use(rollbar.errorHandler());
mongoConnection(modeEnv);
app.use(morgan('dev'));

app.get('/', (req, res, next) => {
    res.send('Shengapi start !').end();
});

RouterBuilder.build(app);
const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.on('connection', function(client) {
    console.log('Client connected !');

    client.on('file_created', function(data)   {
        fs.writeFile(process.env.FILES_PATH + data.name, data.content, function (err) {
            if (err) throw err;
            console.log(data.name + ' file created !');
        });
    });

    client.on('file_deleted', function (data) {
        let isFolder = fs.lstatSync(process.env.FILES_PATH + data.name).isDirectory();
        if(isFolder) {
            fs.rmdir(process.env.FILES_PATH + data.name, function (err) {
                if (err) throw err;
            });
            console.log(data.name + ' folder deleted !');
        }
        else {
            fs.unlink(process.env.FILES_PATH + data.name, function (err) {
                if (err) throw err;
            });
            console.log(data.name + ' file deleted !');
        }
    });

    client.on('folder_created', function(data)   {
        if(!fs.existsSync(process.env.FILES_PATH + data.name)) {
            fs.mkdir(process.env.FILES_PATH + data.name, function (err) {
                if (err) throw err;
            });
            console.log(data.name + ' folder created !');
        }
    });

});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Listening on ${port} ....`));
//app.listen(port, () => console.log(`Listening on ${port} ....`));
