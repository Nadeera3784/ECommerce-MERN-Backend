const User = require('../models/user.model');
const {
    validationResult
} = require('express-validator');
const jwt = require('jsonwebtoken')
const expressJWT = require('express-jwt')
const {
    errorHandler
} = require('../helpers/dbErrorHandling')

exports.signup = (req, res) => {
    const user = new User(req.body);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)[0];
        return res.status(422).json({
            errors: firstError
        });
    }

    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                err: errorHandler(err)
            });
        }
        user.salt = undefined
        user.hashed_password = undefined
        res.json({
            user
        })
    });
};

exports.signin = (req, res) => {
    const {
        email,
        password
    } = req.body;

    // Check if email exists
    User.findOne({
        email
    }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User with that email does not exist. Please Signup'
            })
        }


        // Generate a signed token with user id and secret
        const token = jwt.sign({
            _id: user._id
        }, process.env.JWT_SECRET)

        // if password incorrect
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: 'Email and password don\'t match'
            })
        }

        // Persist the token as tokenEXP in cookie with expiry date
        res.cookie('tokenEXP', token, {
            expire: new Date() + 3600
        })
        // return response with user and token to fronted client
        const {
            _id,
            name,
            email,
            role
        } = user
        return res.json({
            token,
            user: {
                _id,
                email,
                name,
                role
            }
        })
    })
}

exports.signout = (req, res) => {
    res.clearCookie("tokenEXP")
    res.json({
        message: "signout scuccess"
    })
}

// Require signin
exports.requireSignin = expressJWT({
    secret: process.env.JWT_SECRET,
    userProperty: "auth"
})