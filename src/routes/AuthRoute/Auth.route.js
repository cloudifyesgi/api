'use strict';

const express = require('express');
const bodyParser = require("body-parser");
const router = express.Router();
const AuthController = require("../../controllers").AuthController;
const TransactionController = require("../../controllers").TransactionController;

router.use(bodyParser.json());

router.post('/login', async (req, res, next) => {
    try {
        const response = await AuthController.login(req.body.email, req.body.password);
        if(response.success) {
            res.json(response);
        } else {
            res.status(401).send(response).end();
        }
    } catch(e) {
        console.error(e);
        res.status(401).end();
    }
    /*const auths = await AuthController.getAll();
    res.json(auths);*/
});

router.post('/register', async (req, res) => {
    const email = req.body.email;
    const name = req.body.name;
    const firstname = req.body.firstname;
    const password = req.body.password;
    try {
        const g = await AuthController.register(email, name, firstname, password);
        try {
            await TransactionController.userFirstTransaction(g._id);
            res.status(201).json(g).end();
        } catch(err) {
            console.log(err);
            res.status(500).end();
        }
    } catch(err) {
        console.log(err);
        res.status(409).end();
    }
});
module.exports = router;

