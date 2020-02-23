const express = require('express')

const router = express.Router()

const {
    signup,
    signin,
    signout
} = require('../controllers/user.controller')

const {
    check,
    validationResult
} = require('express-validator');

router.post('/signup', [
    check('name', 'Name is required').notEmpty().isLength({
        min: 4,
        max: 16
    }).withMessage('name must be between 3 to 16 characters'),
    check('email', 'Email is required and must be between 3 to 32 characters')
    .notEmpty()
    .isEmail()
    .isLength({
        min: 4,
        max: 32
    })
    .matches(/.+\@.+\..+/).withMessage('Email must contain @'),
    check('password', 'password is required').notEmpty(),
    check('password').isLength({
        min: 6
    }).withMessage('Password must contain at least 6 characters').matches(/\d/).withMessage('password must contain a number')
], signup);


router.post('/signin', signin)
router.get('/signout', signout)
module.exports = router