'use strict';

const express = require('express');
const bodyParser = require("body-parser");
const router = express.Router();
const SubscriptionStatusController = require("../../controllers").SubscriptionStatusController;
const UserController = require("../../controllers").UserController;
const AuthController = require('../../controllers').AuthController;

router.use(bodyParser.json());
router.use(AuthController.authenticate());

router.get('/', UserController.checkLevel(1), async (req, res) => {
    const users = await SubscriptionStatusController.getAll();
    res.json(users);
}).get('/:id', UserController.checkLevel(1), async (req, res) => {
    try {
        const SubscriptionStatuss = await SubscriptionStatusController.getById(req.params.id);
        res.json(SubscriptionStatuss);
    } catch (e) {
        res.status(409).end();
    }
});

router.post('/', async (req, res) => {
    try {
        const g = await SubscriptionStatusController.create(req.body.name,req.body.storage,req.body.file_number,req.body.file_size,req.body.price,req.body.description,req.body.directory_number,req.body.update_date,req.body.update_type,req.body.subscription_id);
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
        const g = await SubscriptionStatusController.update(id, req.body);

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
        const g = await SubscriptionStatusController.delete(id);
        res.status(200).end();
    } catch(err) {
        res.status(409).end();
    }
});


module.exports = router;
