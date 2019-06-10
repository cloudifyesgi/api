'use strict';

const express = require('express');
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload');
const fileSystem = require('fs');
const path = require('path');
const router = express.Router();
const FileController = require("../../controllers").FileController;
const UserController = require("../../controllers").UserController;
const AuthController = require('../../controllers').AuthController;
const HistoryController = require('../../controllers').HistoryController;

router.use(bodyParser.json());
router.use(AuthController.authenticate());
router.use(fileUpload());


router.get('/', UserController.checkLevel(1), async (req, res) => {
    console.log('A file id must be specified');
    res.status(404).end();
}).get('/:id', UserController.checkLevel(1), async (req, res) => {
    try {
        //const Files = await FileController.getById(req.params.id);
        const filePath = path.join(process.env.FILES_PATH + "5cfd3075af0f39191cdbc438");
        const stat = fileSystem.statSync(filePath);

        res.writeHead(200, {
            'Content-Type': 'text/plain',
            'Content-Length': stat.size
        });

        const readStream = fileSystem.createReadStream(filePath);
        // We replaced all the event handlers with a simple call to readStream.pipe()
        readStream.pipe(res);
        //res.json(Files);
    } catch (e) {
        console.log(e.toString());
        res.status(409).end();
    }
});

module.exports = router;
