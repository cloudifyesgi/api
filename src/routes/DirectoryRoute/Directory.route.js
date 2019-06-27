'use strict';

const express = require('express');
const bodyParser = require("body-parser");
const router = express.Router();
const DirectoryController = require("../../controllers").DirectoryController;
const UserController = require("../../controllers").UserController;
const AuthController = require('../../controllers').AuthController;
const HistoryController = require('../../controllers').HistoryController;

router.use(bodyParser.json());
router.use(AuthController.authenticate());

router.get('/', UserController.checkLevel(1), async (req, res) => {
    const directories = await DirectoryController.getAll();
    res.json(directories);
}).get('/:id', UserController.checkLevel(1), async (req, res) => {
    try {
        const directories = await DirectoryController.getById(req.params.id);
        res.json(directories).status(200).end();
    } catch (e) {
        res.status(409).end();
    }
}).get('/:id/children', async (req, res) => {
    try {
        const parentId = req.params.id;
        const children = await DirectoryController.getDirectoryByParent(parentId, req.user.id);
        console.log(req.user.id);
        const breadcrumb = await DirectoryController.getTreeDirectory(parentId, req.user.id);
        const result = {children: children, breadcrumb: breadcrumb};
        res.json(result).status(200).end();

    } catch (e) {
        console.log(e);
        res.status(404).end();
    }
}).get('/:id/files', async (req, res) => {
    try {
        const id = req.params.id;
        const files = await DirectoryController.getFilesByDirectory(id, req.user.id);
        res.json(files).status(200).end();
    } catch (e) {
        console.log(e);
        res.status(404).end();
    }
}).get('/:id/histories', UserController.checkLevel(1), async (req, res) => {
    try {
        const histories = await HistoryController.getByDirectories(req.params.id);
        console.log(histories);
        res.json(histories);
    } catch (e) {
        console.log(e);
        res.status(409).end();
    }
});

router.post('/', async (req, res) => {
    try {
        const g = await DirectoryController.create(req.body.name, req.user._id, req.body.parent_directory);
        if(g) {
            HistoryController.create('created', g._id, null, null, null, req.user.id);
            HistoryController.create('addedDir', req.body.parent_directory, null, g._id, null, req.user.id);
            console.log(g);
            res.json(g).status(201).end();
        } else {
            res.status(500).end();
        }

    } catch (err) {
        console.log(err);
        res.status(409).end();
    }
});

router.put('/', async (req, res) => {
    const id = req.body.id;
    if (id === undefined) {
        return res.status(400).end();
    }

    try {
        const g = await DirectoryController.update(id, req.body);

        if (g === null || g === undefined) res.status(204).end();
        else res.status(200).end();
    } catch (err) {
        res.status(400).end();
    }
});

router.delete('/', async (req, res) => {
    const id = req.body.id;
    if (id === undefined) {
        return res.status(400).end();
    }
    try {
        const g = await DirectoryController.delete(id);
        res.status(200).end();
    } catch (err) {
        res.status(409).end();
    }
});


module.exports = router;
