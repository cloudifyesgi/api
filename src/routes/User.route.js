'use strict';

const express = require('express');
const bodyParser = require("body-parser");
const router = express.Router();
const UserController = require("../controllers").UserController;
const AuthController = require('../controllers').AuthController;

router.use(bodyParser.json());
router.use(AuthController.authenticate());

router.get('/', UserController.checkLevel(1), async (req, res) => {
    const users = await UserController.getAll('-password');
    res.json(users);
}).get('/:email', UserController.checkLevel(1), async (req, res) => {
    try {
        const users = await UserController.getByEmail(req.params.email);
        res.json(users);
    } catch (e) {
        res.status(409).end();
    }
});

router.post('/', async (req, res) => {
    const email = req.body.email;
    const name = req.body.name;
    const firstname = req.body.firstname;
    const password = req.body.password;
    try {
        const g = await UserController.create(email, name, firstname, password);
        res.status(201).end();
    } catch(err) {
        console.log(err.toString());
        res.status(409).end();
    }
});

router.put('/', async (req, res, next) => {
    const email = req.body.email;
    if(email === undefined){
        return res.status(400).end();
    }

    try {
        const g = await UserController.update(email, req.body);

        if(g === null || g === undefined) res.status(204).end();
        else res.status(200).end();
    } catch(err) {
        console.log(err);
        res.status(400).end();
    }
});

router.delete('/', async (req, res, next) => {
    const email = req.body.email;
    if(email === undefined) {
        return res.status(400).end();
    }
    try {
        const g = await UserController.delete(email);
        console.log(g);
        res.status(200).end();
    } catch(err) {
        res.status(409).end();
    }
});



module.exports = router;
