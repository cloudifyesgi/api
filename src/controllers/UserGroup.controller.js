'use strict';

const models = require('../models');
const UserGroup = models.UserGroup;

class UserGroupController {

    constructor() {

    }

    async create(creator,name) {
        let newUserGroup = new UserGroup({
            creator:creator,
            name:name
        });
        await newUserGroup.save((err,newUser) =>{
            if (err) return console.error(err);
            else console.log(newUser);
        });
    }

    async getAll() {
        let userGroups = await UserGroup.find({},function(err,userGroups){
            if(err){
                console.error(err);
                return undefined;
            }
            return userGroups;

        });
        return userGroups;
    }

    async getById(id) {
        //TODO
    }

    async getUserAllGroups(creator) {
        let userGroups = await UserGroup.find({creator: creator},function(err,userGroups){
            if(err){
                console.error(err);
                return undefined;
            }
            return userGroups;

        });
        return userGroups;
    }

    async update(_id, name) {

        let userGroup = await UserGroup.findOneAndUpdate(
            {
                _id:_id
            },{
                $set:{
                    name : name
                }
            },{
                new : false
            }, (err,userGroup) =>{
                if(err){
                    return undefined;
                }
            });
        return userGroup;
    }

    async addUser(_id, user_id) {

        let userGroup = await UserGroup.findOne({_id: _id},function(err,userGroups){
            if(err){
                console.error(err);
                return undefined;
            }
            return userGroups;
        });

        userGroup.users.push(user_id);

        userGroup = await UserGroup.findOneAndUpdate(
            {
                _id:_id
            },{
                $set:{
                    users : userGroup.users
                }
            },{
                new : false
            }, (err,userGroup) =>{
                if(err){
                    return undefined;
                }
        });
        return userGroup;
    }
}

module.exports = new UserGroupController();
