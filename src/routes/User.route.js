'use strict';

const express = require('express');
const bodyParser = require("body-parser");
const router = express.Router();
const UserController = require("../controllers").UserController;
const AuthController = require('../controllers').AuthController;

router.use(bodyParser.json());
// router.use(AuthController.authenticate());

router.get('/', async (req, res, next) => {
    const users = await UserController.getAll(req,res);
    console.log('user route');
    console.log(req.user);
    res.json(users);
});

router.post('/', async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const g = await UserController.create(email,password);
        res.status(201).end();
    } catch(err) {
        res.status(409).end();
    }
});

router.put('/', async (req, res, next) => {
    const email = req.body.email;
    if(email === undefined){
        return res.status(400).end();
    }

    const password = req.body.password;
    const name = req.body.name ;
    const firstname = req.body.firstname ;
    const phone_number = req.body.phone_number ;
    const address = req.body.address ;
    const postal = req.body.postal ;
    const city = req.body.city ;
    const is_deleted = req.body.is_deleted ;
    const rank = req.body.rank ;
    const language = req.body.language ;
    try {

        const g = await UserController.updateUser(
            email,
            password,
            name,
            firstname,
            phone_number,
            address,
            postal,
            city,
            is_deleted,
            rank,
            language);
        res.status(201).end();
    } catch(err) {
        console.log(err);
        res.status(400).end();
    }
});



module.exports = router;
