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
    const users = await FileController.getAll();
    res.json(users);
}).get('/:id', UserController.checkLevel(1), async (req, res) => {
    try {
        const Files = await FileController.getById(req.params.id);
        res.json(Files);
    } catch (e) {
        res.status(409).end();
    }
});


router.post('/', async (req, res) => {
    try {
        if(!req.files) {
            console.log('No file to upload or file empty');
            return res.status(409).end();
        }
        const g = await FileController.create(req.body.name,req.body.date_create,req.body.file_version,req.body.file_type,req.body.user_create,req.body.user_update,req.body.directory);
        let fileToUpload = req.files.file;
        if(!fileToUpload) {
            console.log('Error while uploading the file');
            return res.status(409).end();
        }

        fileToUpload.mv(process.env.FILES_PATH + g._id, function(err) {
            if (err)
                return res.status(500).send(err);
            console.log('File uploaded!');
        });
        const h = await HistoryController.create("upload",req.body.date_create);
        res.status(201).end();
    } catch(err) {
        console.log(err.toString());
        res.status(409).end();
    }
});

router.put('/', async (req, res) => {
    const id = req.body.id;
    if(id === undefined){
        return res.status(400).end();
    }

    try {
        const g = await FileController.update(id, req.body);

        if(g === null || g === undefined) res.status(204).end();
        else res.status(200).end();
    } catch(err) {
        res.status(400).end();
    }
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    if(id === undefined) {
        return res.status(400).end();
    }
    try {
        const g = await FileController.delete(id);
        res.status(200).end();
    } catch(err) {
        res.status(409).end();
    }
});


module.exports = router;
