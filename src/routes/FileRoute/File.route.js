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
const QuotaController   = require('../../controllers').QuotaController;

router.use(bodyParser.json());
router.use(AuthController.authenticate());
router.use(fileUpload());

router.get('/', async (req, res) => {
    const users = await FileController.getAll();
    res.json(users);
}).get('/:id', async (req, res) => {
    try {
        const Files = await FileController.getById(req.params.id);
        res.json(Files);
    } catch (e) {
        res.status(409).end();
    }
}).get('/:name/:directory/versions', async (req, res) => {
    try {
        const files = await FileController.getAllVersions(req.params.name, req.params.directory);
        res.json(files);
    } catch (e) {
        console.log(e.toString());
        res.status(409).end();
    }
}).get('/version/:name/:directory/:number', async (req, res) => {
    try {
        const file = await FileController.getVersion(req.params.name, req.params.number, req.params.directory);
        HistoryController.create('reverted', null, file[0]._id, null, null, req.user.id);
        res.json(file);
    } catch (e) {
        console.log(e.toString());
        res.status(409).end();
    }
});


router.post('/',QuotaController.checkUpload(),async (req, res) => {
    try {
        if (!req.files) {
            return res.status(409).end();
        }
        let g                = null;
        const isFirstVersion = await FileController.isFirstVersion(req.body.name, req.body.directory);
        if (isFirstVersion) {
            g = await FileController.create(req.body.name, req.body.date_create, 1, req.body.file_type, req.body.user_create, req.body.directory);
            HistoryController.create('created', null, g._id, null, null, req.user.id);
        } else {
            await FileController.undeleteOldVersion(req.body.name, req.body.directory);
            const lastVersion = await FileController.getLastVersion(req.body.name, req.body.directory);
            g                 = await FileController.create(req.body.name, req.body.date_create, parseInt(lastVersion.file_version, 10) + 1, req.body.file_type, req.body.user_update, req.body.directory);
            await FileController.redirectTarget(lastVersion, g);
            HistoryController.create('updated', null, g._id, null, null, req.user.id);
        }

        let fileToUpload = req.files.file;
        if (!fileToUpload) {
            return res.status(409).end();
        }

        fileToUpload.mv(process.env.FILES_PATH + g._id, function (err) {
            if (err)
                return res.status(500).send(err);
        });
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
            HistoryController.create('renamed', null, g._id, null, null, req.user.id);
            res.status(200).end();
        }
    } catch (err) {
        console.log(err);
        res.status(400).end();
    }
});

router.delete('/delete/:id/:idParent', async (req, res) => {
    const id = req.params.id;
    const idParent = req.params.idParent;
    if (id === undefined || idParent === undefined) {
        return res.status(400).end();
    }
    try {
        const file = await FileController.getById(id);

        if(file) {
            const g = await FileController.softDelete(id);
            HistoryController.create('deleted', null, id, null, null, req.user.id);
            HistoryController.create('deletedFile', file.directory, null, null, file._id, req.user.id);
        }

        res.status(200).end();
    } catch (err) {
        console.log(err.toString());
        res.status(409).end();
    }
}).delete('/undelete/:id', async (req, res) => {
    const id = req.params.id;
    if (id === undefined) {
        return res.status(400).end();
    }

    try {
        const file = await FileController.getById(id);

        if (file) {
            const g = await FileController.undelete(id);
            HistoryController.create('restored', null, id, null, null, req.user.id);
        }
        res.json(file);
        res.status(200).end();
    } catch (e) {
        console.log(e.toString());
        res.status(409).end();
    }
}).delete('/hard/:id', async (req ,res) => {
    const id = req.params.id;
    if (id === undefined) {
        return res.status(400).end();
    }

    try {
        const file = await FileController.getById(id);

        if (file) {
            const g = await FileController.hardDelete(id);
        }
        res.json(file);
        res.status(200).end();
    } catch (e) {
        console.log(e.toString());
        res.status(409).end();
    }
});


module.exports = router;
