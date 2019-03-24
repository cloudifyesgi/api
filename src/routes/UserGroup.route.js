'use strict';

const express = require('express');
const bodyParser = require("body-parser");
const router = express.Router();
const UserGroupController = require("../controllers").UserGroupController;

router.use(bodyParser.json());

/**
 * Get all userGroups
 */
router.get('/', async (req, res, next) => {
    const users = await UserGroupController.getAll(req,res);
    res.json(users);
});

/**
 * Return all userGroups of a user.
 * String creator : Creator's id
 */
router.get('/user/:creator', async (req, res, next) => {
    let creator = req.params.creator;
    if(creator !== undefined){
        const userGroups = await UserGroupController.getUserAllGroups(creator);
        res.json(userGroups);
    }else{
        res.status(404).end();
    }

});

/**
 * Create a userGroup for a user
 * String creator : Creator's id
 * String name : userGroup's name
 */
router.post('/user', async (req, res, next) => {
    let creator = req.body.creator;
    let name = req.body.name;
    try {
        const g = await UserGroupController.create(creator,name);
        res.status(201).end();
    } catch(err) {
        res.status(409).end();
    }
});

/**
 * Update a userGroup
 * String _id : userGroup id
 * String name : userGroup new name
 */
router.put('/', async (req, res, next) => {
    let _id = req.body._id;
    let name = req.body.name ;
    if(_id === undefined || name === undefined){
        return res.status(400).end();
    }
    try {

        const g = await UserGroupController.update(_id,name);
        res.status(201).end();
    } catch(err) {
        console.log(err);
        res.status(400).end();
    }
});

/**
 * Add a user to userGroup
 * String _id : userGroup's id
 * String user_id : user to be added's id
 */
router.put('/user', async (req, res, next) => {
    let _id = req.body._id;
    let user_id = req.body.user_id ;
    if(_id === undefined || user_id === undefined){
        return res.status(400).end();
    }
    try {

        const g = await UserGroupController.addUser(_id,user_id);
        res.status(201).end();
    } catch(err) {
        console.log(err);
        res.status(400).end();
    }
});

module.exports = router;
