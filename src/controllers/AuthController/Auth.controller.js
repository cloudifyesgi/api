'use strict';

const models = require('../../models');
const jwt = require('jsonwebtoken');
const passport = require('passport');
require('../../config').passport(passport);
const dotenv = require('dotenv');
dotenv.config();
const User = models.User;

class AuthController {

    constructor() {

    }

    async login(email, password) {
        const user = await User.findOne({
            email: email
        });
        if (!user) {
            return {success: false, message: "authentication failed"};
        } else {
            // check if password matches
            if(user.comparePassword(password)) {
                const token = jwt.sign(user.toJSON(), process.env.PASSPORT_SECRET,{ expiresIn: '5days' });
                // return the information including token as JSON
                return {success: true, message: token, user: user};
            } else {
                console.log('test');
                return {success: false, message: "authentication failed"};
            }
        }
    }

    async register(email, name, firstname,  password) {
        let newUser = new User({
            email: email,
            name: name,
            firstname: firstname,
            password: password
        });
        return await newUser.save();
    }

    authenticate(){
        return (req, res, next) => {
            passport.authenticate('jwt', {session: false}, (err, user, info) => {
                if(!user) {
                    if (info.name === "TokenExpiredError") {
                        return res.status(401).json({success: false, expired: true, message: "Your token has expired." });
                    } else {
                        console.log('hey');
                        return res.status(401).json({success: false, expired: false,  message: info.message });
                    }
                }
                req.user = user;
                next();
            })(req, res, next);
        }
    };
}

module.exports = new AuthController();
