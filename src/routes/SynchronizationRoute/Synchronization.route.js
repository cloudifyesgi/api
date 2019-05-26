'use strict';

const express = require('express');
const bodyParser = require("body-parser");
const router = express.Router();
const SynchronizationController = require("../../controllers").SynchronizationController;
const UserController = require("../../controllers").UserController;
const AuthController = require('../../controllers').AuthController;

router.use(bodyParser.json());
router.use(AuthController.authenticate());

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
        const g = await SynchronizationController.create(req.body.local_path);
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

router.delete('/', async (req, res) => {
    const id = req.body.id;
    if(id === undefined) {
        return res.status(400).end();
    }
    try {
        const g = await SynchronizationController.delete(id);
        res.status(200).end();
    } catch(err) {
        res.status(409).end();
    }
});


module.exports = router;
