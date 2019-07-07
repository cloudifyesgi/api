'use strict';

const express = require('express');
const bodyParser = require("body-parser");
const router = express.Router();
const RightController = require("../../controllers").RightController;
const UserController = require("../../controllers").UserController;
const AuthController = require('../../controllers').AuthController;

router.use(bodyParser.json());
router.use(AuthController.authenticate());

router.get('/', UserController.checkLevel(1), async (req, res) => {
    const users = await RightController.getAll();
    res.json(users);
}).get('/:id', async (req, res) => {
    try {
        const Rights = await RightController.getById(req.params.id);
        res.json(Rights);
    } catch (e) {
        res.status(409).end();
    }
}).get('/directory/:id', async (req, res) => {
    try {
        const Folders = await RightController.getFoldersByUser(req.params.id);
        res.json(Folders);
    } catch (e) {
        res.status(409).end();
    }
}).get('/file/:id', async (req, res) => {
    try {
        const Files = await RightController.getFilesByUser(req.params.id);
        res.json(Files);
    } catch (e) {
        res.status(409).end();
    }
}).get('/sharedDir/:directoryId', async (req, res) => {
    try {
        const Rights = await RightController.getRightsByDir(req.params.directoryId);
        res.json(Rights);
    } catch (e) {
        res.status(409).end();
    }
}).get('/sharedFile/:fileId', async (req, res) => {
    try {
        const Rights = await RightController.getRightsByFile(req.params.fileId);
        res.json(Rights);
    } catch (e) {
        res.status(409).end();
    }
}).get('/DirShare/:sharedDir/:userId', async (req, res) => {
    try {
        const Right = await RightController.getRightByDirAndUser(req.params.sharedDir, req.params.userId);
        res.json(Right);
    } catch (e) {
        res.status(409).end();
    }
}).get('/FileShare/:sharedFile/:userId', async (req, res) => {
    try {
        const Right = await RightController.getRightByFileAndUser(req.params.sharedFile, req.params.userId);
        res.json(Right);
    } catch (e) {
        res.status(409).end();
    }
});

router.post('/', async (req, res) => {
    try {
        const mails = req.body.email;
        if (mails === undefined) {
            console.log('no email specified');
            return res.status(400).end();
        }
        const ids = [];
        const start = async () => {
            await RightController.asyncForEach(mails, async (
                element) => {
                await UserController.getByEmail(element).then( value => {
                    if (value === null) {
                        console.log('email doesnt exist');
                        return;
                    }
                    ids.push(value._id);
                });
            });
        };
        await start();
        if (ids.length !== mails.length) {
            return res.status(401).end();
        }
        const end = async () => {
            await RightController.asyncForEach(ids, async (
                element) => {
                const g = await RightController.create(req.body.right,req.body.directory,req.body.file,element);
            });
        };
        await end();

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
        const g = await RightController.update(id, req.body);

        if(g === null || g === undefined) res.status(204).end();
        else res.status(200).end();
    } catch(err) {
        res.status(400).end();
    }
});

router.delete('/', async (req, res) => {
    const id = req.body.id;
    if(id === undefined) {
        return res.status(400).end();
    }
    try {
        const g = await RightController.delete(id);
        res.status(200).end();
    } catch(err) {
        res.status(409).end();
    }
}).delete('/:id', async (req, res) => {
    const id = req.params.id;
    if(id === undefined) {
        return res.status(400).end();
    }
    try {
        const g = await RightController.delete(id);
        res.status(200).end();
    } catch(err) {
        console.log(err.toString());
        res.status(409).end();
    }
});


module.exports = router;
