'use strict';

const express = require('express');
const bodyParser = require("body-parser");
const router = express.Router();
const Io = require('./../../config/socket.io')();

const DirectoryController = require("../../controllers").DirectoryController;
const DocifyController = require("../../controllers").DocifyController;
const UserController = require("../../controllers").UserController;
const AuthController = require('../../controllers').AuthController;
const HistoryController = require('../../controllers').HistoryController;

router.use(bodyParser.json());
router.use(AuthController.authenticate());

router.get('/', async(req, res) => {
    try {
        const docify = await DocifyController.softGetAll();
        res.json(docify).status(200).end();
    } catch(e) {
        res.send(404).end();
    }
}).get('/:docifyId', async(req, res) => {
    try {
        const docify = await DocifyController.softGetById(req.params.docifyId);
        res.json(docify).status(200).end();
    } catch(e) {
        res.send(404).end();
    }
});
router.post('/', async (req, res) => {
    try {
        const g = await DocifyController.create(req.body.name, req.user.id, req.body.parent_directory);
        if(g) {
            // HistoryController.create('created', g._id, null, null, null, req.user.id);
            // HistoryController.create('addDocify', req.body.parent_directory, null, g._id, null, req.user.id);
            res.json(g).status(201).end();
        } else {
            res.status(500).end();
        }

    } catch (err) {
        res.status(404).end();
    }
});

router.delete('/:id', async (req, res) => {
/*    const id = req.params.id;
    if (id === undefined) {
        return res.status(400).end();
    }
    try {
        const directory = await DirectoryController.getById(id);

        if(directory) {
            const g = await DirectoryController.delete(id);
            HistoryController.create('deletedDir', directory.parent_directory, null, directory._id, null, req.user.id);
        }

        res.status(200).end();
    } catch (err) {
        res.status(404).end();
    }*/
});


module.exports = router;
