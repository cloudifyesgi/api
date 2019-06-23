'use strict';

const FileController = require("./controllers").FileController;
const DirectoryController = require("./controllers").DirectoryController;
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
const ObjectId = require('mongodb').ObjectID;
const cors = require('cors');

const RouterBuilder = require('./routes');
const app = express();
// app.use(rollbar.errorHandler());
const connection = mongoConnection(modeEnv);
app.use(morgan('dev'));
app.use(cors());


app.on('close', () => {
    connection.removeAllListeners();
});

RouterBuilder.build(app);
const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.on('connection', function(client) {
    console.log('Client connected !');

    client.on('file_created', async function(data)   {
        const File = await FileController.getById(ObjectId(data.id));
        console.log('File : ' + File);
        try {
            if(!File) {
                console.log('File ' + data.id + ' doesnt exists');
                const g = await FileController.create(data.name, Date.now(), 1, data.extension);
            }
            else {
                const g = await FileController.update(ObjectId(data.id), data.name, File.file_version+1, data.extension); //@TODO update file folder too
            }
        }
        catch (err) {
            console.log(err.toString());
            return;
        }
        fs.writeFile(process.env.FILES_PATH + data.id, data.content, function (err) {
            if (err) throw err;
            console.log(data.id + ' file created !');
        });
    });

    client.on('file_deleted', async function (data) {
        try {
            if (data.isFile) {
                console.log('ObjectId(data.id) : ' + ObjectId(data.id));
                const g = await FileController.delete(ObjectId(data.id));
                fs.unlink(process.env.FILES_PATH + data.id, function (err) {
                    if (err) throw err;
                });
                console.log(data.id + ' file deleted !');
            } else {
                const g = await DirectoryController.delete(ObjectId(data.id));
                console.log(data.id + ' folder deleted !');
            }
        }
        catch (e) {
            console.log(e.toString());
        }
    });

    client.on('folder_created', function(data)   {
        const Folder = DirectoryController.getById(ObjectId(data.id));
        try {
            if (!Folder) {
                console.log('Folder ' + data.id + ' doesnt exists');
                const g = DirectoryController.create(data.name, data.path, Date.now()); //@TODO update user_create, user_update
            } else {
                const g = DirectoryController.update(ObjectId(data.id), data.name, data.path);
            }
        }
        catch (e) {
            console.log(e.toString());
        }
    });

});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Listening on ${port} ....`));
//app.listen(port, () => console.log(`Listening on ${port} ....`));
