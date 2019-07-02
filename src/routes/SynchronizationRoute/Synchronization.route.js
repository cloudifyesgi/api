'use strict';

const express = require('express');
const bodyParser = require("body-parser");
const router = express.Router();
const SynchronizationController = require("../../controllers").SynchronizationController;
const UserController = require("../../controllers").UserController;
const AuthController = require('../../controllers').AuthController;
const mongoose = require('mongoose');

router.use(bodyParser.json());
router.use(AuthController.authenticate());



router.get('/map/:id', async (req, res) => {
    try {
        const g = await SynchronizationController.getSyncFolderMapById(req.params.id);
        res.json(g).status(201).end();
    } catch(err) {
        console.log(err);
        res.status(409).end();
    }
});

router.get('/directory/:directory', async (req, res) => {
    try {
        const g = await SynchronizationController.getByDirectoryAndUser(req.params.directory,req.user._id);
        res.json(g);
        res.status(201).end();
    } catch(err) {
        console.log(err);
        res.status(409).end();
    }
});

router.get('/user/', async (req, res) => {
    try {
        const g = await SynchronizationController.getByUser(req.user._id);
        res.json(g);
        res.status(201).end();
    } catch(err) {
        console.log(err);
        res.status(409).end();
    }
});

router.get('/', UserController.checkLevel(1), async (req, res) => {
    const users = await SynchronizationController.getAll();
    res.json(users);
    }).get('/:id', UserController.checkLevel(1), async (req, res) => {
    try {
        const Synchronizations = await SynchronizationController.getById(req.params.id);
        res.json(Synchronizations);
    } catch (e) {
        res.status(409).end();
    }
});

router.post('/', async (req, res) => {
    try {
        const g = await SynchronizationController.create(req.body.local_path,req.body.directory,req.user._id);
        res.status(201).end();
    } catch(err) {
        res.status(409).end();
    }
});

router.put('/', async (req, res) => {
    const id = req.body.id;
    if(id === undefined){
        return res.status(400).end();
    }

    try {
        const g = await SynchronizationController.update(id, req.body);

        if(g === null || g === undefined) res.status(204).end();
        else res.status(200).end();
    } catch(err) {
        res.status(400).end();
    }
});

router.delete('/:id', async (req, res) => {
    if(req.params.id === undefined) {
        return res.status(400).end();
    }
    const id = mongoose.Types.ObjectId(req.params.id);
    try {
        const g = await SynchronizationController.delete(id);
        res.status(200).end();
    } catch(err) {
        res.status(409).end();
    }
});


module.exports = router;
