'use strict';

const models = require('../models');
const User = models.User;


class UserController {

    constructor() {

    }

    async create(email,password) {
        let newUser = new User({
            email : email,
            password:password
        });
        await newUser.save((err,newUser) =>{
            if (err) return console.error(err);
            else console.log(newUser);
        });
    }

    async getAll() {
        let users = await User.find({},'email name firstname phone_number address postal city is_deleted rank language',function(err,users){
            if(err){
                console.error(err);
                return undefined;
            } else{
                return users;
            }
        });
        return users;
    }

    async getByEmail(email) {
        let user = await User.findOne({email:email},function(err,user){
            if(err){
                console.error(err);
                return undefined;
            } else{

                return user;
            }
        });
        return user;

    }

    async updateUser(email, password, name, firstname, phone_number, address, postal, city, is_deleted, rank, language) {

        let user = await this.getByEmail(email);
        if(user === undefined){
            return undefined;
        }
        password = password === undefined ? user.password : password;
        name = name === undefined ? user.name : name;
        firstname = firstname === undefined ? user.firstname : firstname;
        phone_number = phone_number === undefined ? user.phone_number : phone_number;
        address = address === undefined ? user.address : address;
        postal = postal === undefined ? user.postal : postal;
        city = city === undefined ? user.city : city;
        is_deleted = is_deleted === undefined ? user.is_deleted : is_deleted;
        rank = rank === undefined ? user.rank : rank;
        language = language === undefined ? user.rank : language;

        user = await User.findOneAndUpdate(
            {
                email:email
            },{
                $set:{
                    password : password ,
                    name : name ,
                    firstname : firstname ,
                    phone_number : phone_number ,
                    address : address ,
                    postal : postal ,
                    city : city ,
                    is_deleted : is_deleted ,
                    rank : rank ,
                    language : language
                }
            },{
                new : false
            }, (err,user) =>{
                if(err){
                    return undefined;
                }
        });
        return user;
    }

}

module.exports = new UserController();
