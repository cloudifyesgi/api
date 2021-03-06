'use strict';

const express = require('express');
const bodyParser = require("body-parser");
const router = express.Router();
const TransactionController = require("../../controllers").TransactionController;
const QuotaController = require("../../controllers").QuotaController;
const UserController = require("../../controllers").UserController;
const AuthController = require('../../controllers').AuthController;

router.use(bodyParser.json());
router.use(AuthController.authenticate());



router.get('/', async (req, res) => {
    const users = await TransactionController.getAll();    res.json(users);
}).get('/current', async(req, res) =>{
    try{
        const q = await QuotaController.getCurrentSubscription(req.user._id);
        res.json(q);
        res.status(201).end();
    }catch (e){
        console.log(e);
        res.status(409).end();
    }
}).get('/:id', async (req, res) => {
    try {
        const Transactions = await TransactionController.getById(req.params.id);
        res.json(Transactions);
    } catch (e) {
        res.status(409).end();
    }
});

router.post('/', async (req, res) => {
    try {
        const g = await TransactionController.create(req.body.type,req.body.reference,req.body.path,req.body.name_subscription,req.body.price_subscription,req.body.subscription,req.user._id);
        res.status(201).end();
    } catch(err) {
        console.log(err);
        res.status(409).end();
    }
});

router.put('/', async (req, res) => {
    const id = req.body.id;
    if(id === undefined){
        return res.status(400).end();
    }

    try {
        const g = await TransactionController.update(id, req.body);

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
        const g = await TransactionController.delete(id);
        res.status(200).end();
    } catch(err) {
        res.status(409).end();
    }
});


module.exports = router;
