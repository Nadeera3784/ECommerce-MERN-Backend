const express = require('express')
const router = express.Router()

const {
    create
} = require('../controllers/category.controller')

const {
    requireSignin,
    isAdmin,
    isAuth
} = require('../controllers/auth.controller')
const {
    userById
} = require('../controllers/user.controller')

router.post("/category/create/:userId", requireSignin, isAdmin, isAuth, create)

router.param('userId', userById)

module.exports = router