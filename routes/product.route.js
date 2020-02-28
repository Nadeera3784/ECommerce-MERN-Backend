const express = require('express')
const router = express.Router()

const {
    create,
    productById,
    readProduct
} = require('../controllers/product.controller')

const {
    requireSignin,
    isAdmin,
    isAuth
} = require('../controllers/auth.controller')
const {
    userById
} = require('../controllers/user.controller')

router.get("/product/:productId", readProduct)
router.post("/product/create/:userId", requireSignin, isAdmin, isAuth, create)

router.param('userId', userById)
router.param('productId', productById)

module.exports = router