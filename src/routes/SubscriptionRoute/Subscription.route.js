'use strict';

const express = require('express');
const bodyParser = require("body-parser");
const router = express.Router();
const SubscriptionController = require("../../controllers").SubscriptionController;
const UserController = require("../../controllers").UserController;
const AuthController = require('../../controllers').AuthController;

router.use(bodyParser.json());
router.use(AuthController.authenticate());

router.get('/', async (req, res) => {
    const users = await SubscriptionController.getAll();
    res.json(users);
}).get('/active', async(req, res) =>{
    try{
        const q = await SubscriptionController.getActiveSubscription();
        res.json(q);
        res.status(201).end();
    }catch (e){
        console.log(e);
        res.status(409).end();
    }
}).get('/:id', async (req, res) => {
    try {
        const Subscriptions = await SubscriptionController.getById(req.params.id);
        res.json(Subscriptions);
    } catch (e) {
        res.status(409).end();
    }
});

router.post('/', async (req, res) => {
    try {
        const g = await SubscriptionController.create(req.body.name,req.body.storage,req.body.file_number,req.body.file_size,req.body.price,req.body.description,req.body.directory_number,req.body.status);
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
        const g = await SubscriptionController.update(id, req.body);

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
        const g = await SubscriptionController.delete(id);
        res.status(200).end();
    } catch(err) {
        res.status(409).end();
    }
});


module.exports = router;
