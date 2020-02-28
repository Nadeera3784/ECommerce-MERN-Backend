const express = require('express')
const router = express.Router()

const {
    create,
    categoryById,
    readCategory
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
router.get('/category/:categoryId', readCategory)
router.param('userId', userById)
router.param('categoryId', categoryById)

module.exports = router