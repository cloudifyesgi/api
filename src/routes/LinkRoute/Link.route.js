'use strict';

const express = require('express');
const bodyParser = require("body-parser");
const router = express.Router();
const LinkController = require("../../controllers").LinkController;
const UserController = require("../../controllers").UserController;
const AuthController = require('../../controllers').AuthController;

router.use(bodyParser.json());
router.use(AuthController.authenticate());

router.get('/', async (req, res) => {
    const users = await LinkController.getAll();
    res.json(users);
}).get('/:id', async (req, res) => {
    try {
        const Links = await LinkController.getById(req.params.id);
        console.log('GET /link/:id');
        console.log(Links);
        res.json(Links).status(200);
    } catch (e) {
        res.status(409).end();
    }
}).get('/file/:id', async (req, res) => {
    try {
        const Links = await LinkController.getByFileId(req.params.id);
        res.json(Links);
    } catch (e) {
        console.log(e.toString());
        res.status(409).end();
    }
}).get('/dir/:id', async (req, res) => {
    try {
        const Links = await LinkController.getByDirId(req.params.id);
        res.json(Links);
    } catch (e) {
        console.log(e.toString());
        res.status(409).end();
    }
});

router.post('/', async (req, res) => {
    try {
        const g = await LinkController.create(req.body.link,req.body.link_type,req.body.expiry_date,req.body.is_activated,req.body.link_password,req.body.user,req.body.directory,req.body.file);
        res.json(g).status(201).end();
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
        const g = await LinkController.update(id, req.body);

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
        const g = await LinkController.delete(id);
        res.status(200).end();
    } catch(err) {
        res.status(409).end();
    }
});


module.exports = router;
