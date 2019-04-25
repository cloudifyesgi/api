'use strict';

const models = require('../../models');
const Controller = require('../Controller');
const User = models.User;


class UserController extends Controller {
    constructor() {
        super(User);
    }

    async create(email,password) {
        let newUser = new User({
            email : email,
            password:password
        });
         return await newUser.save();
    }

    //  async getAll() {
    //     return await User.find({}, '-password');
    // }

    async getByEmail(email) {
        return await User.findOne({email: email});
    }

    checkLevel(level) {
        return (req, res, next) => {
            if(req.user.rank >= 1) {
                next();
            }
            else res.status(401).end();
        }
    }
    async update(email, password, name, firstname, phone_number, address, postal, city, is_deleted, rank, language) {

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
