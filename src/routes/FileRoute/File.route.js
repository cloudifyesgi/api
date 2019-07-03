'use strict';

const express           = require('express');
const bodyParser        = require("body-parser");
const fileUpload        = require('express-fileupload');
const fileSystem        = require('fs');
const path              = require('path');
const router            = express.Router();
const FileController    = require("../../controllers").FileController;
const UserController    = require("../../controllers").UserController;
const AuthController    = require('../../controllers').AuthController;
const HistoryController = require('../../controllers').HistoryController;

router.use(bodyParser.json());
router.use(AuthController.authenticate());
router.use(fileUpload());

router.get('/', UserController.checkLevel(1), async (req, res) => {
    const users = await FileController.getAll();
    res.json(users);
}).get('/:id', async (req, res) => {
    try {
        const Files = await FileController.getById(req.params.id);
        res.json(Files);
    } catch (e) {
        res.status(409).end();
    }
}).get('/:name/versions', async (req, res) => {
    try {
        const files = await FileController.getAllVersions(req.params.name);
        res.json(files);
    } catch (e) {
        console.log(e.toString());
        res.status(409).end();
    }
}).get('/version/:name/:number', async (req, res) => {
    try {
        const file = await FileController.getVersion(req.params.name, req.params.number);
        res.json(file);
    } catch (e) {
        console.log(e.toString());
        res.status(409).end();
    }
});


router.post('/', async (req, res) => {
    try {
        if (!req.files) {
            console.log('No file to upload or file empty');
            return res.status(409).end();
        }
        let g                = null;
        const isFirstVersion = await FileController.isFirstVersion(req.body.name, req.body.directory);
        if (isFirstVersion) {
            g = await FileController.create(req.body.name, req.body.date_create, 1, req.body.file_type, req.body.user_create, req.body.directory);
        } else {
            FileController.undeleteOldVersion(req.body.name, req.body.directory);
            const lastVersion = await FileController.getLastVersion(req.body.name, req.body.directory);
            g                 = await FileController.create(req.body.name, req.body.date_create, parseInt(lastVersion, 10) + 1, req.body.file_type, req.body.user_update, req.body.directory);
        }

        let fileToUpload = req.files.file;
        if (!fileToUpload) {
            console.log('Error while uploading the file');
            return res.status(409).end();
        }

        fileToUpload.mv(process.env.FILES_PATH + g._id, function (err) {
            if (err)
                return res.status(500).send(err);
            console.log('File uploaded!');
        });
        HistoryController.create('created', null, g._id, null, null, req.user.id);
        HistoryController.create('addedFile', g.directory, null, null, g._id, req.user.id);
        // const h = await HistoryController.create("upload",req.body.date_create);
        res.status(201).end();
    } catch (err) {
        console.log(err.toString());
        res.status(409).end();
    }
});

router.put('/', async (req, res) => {
    const id = req.body.id;
    if (id === undefined) {
        return res.status(400).end();
    }

    try {
        const g = await FileController.update(id, req.body);

        if (g === null || g === undefined) res.status(204).end();
        else {
            HistoryController.create('modified', null, g._id, null, null, req.user.id);
            res.status(200).end();
        }
    } catch (err) {
        console.log(err);
        res.status(400).end();
    }
});

router.delete('/:id/:idParent', async (req, res) => {
    const id = req.params.id;
    const idParent = req.params.idParent;
    if (id === undefined || idParent === undefined) {
        console.log('id ou idParent undefined');
        return res.status(400).end();
    }
    try {
        const file = await FileController.getById(id);

        if(file) {
            const g = await FileController.delete(id);
            HistoryController.create('deletedFile', file.directory, null, null, file._id, req.user.id);
        }

        res.status(200).end();
    } catch (err) {
        console.log(err);
        res.status(409).end();
    }
});


module.exports = router;
