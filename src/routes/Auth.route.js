'use strict';

const express = require('express');
const bodyParser = require("body-parser");
const router = express.Router();
const AuthController = require("../controllers").AuthController;

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

module.exports = router;

