const express = require('express')
const router = express.Router()

const {
    create,
    productById,
    readProduct,
    removeProduct,
    updateProduct,
    listProducts,
    relatedProducts
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
router.delete("/product/:productId/:userId", requireSignin, isAdmin, isAuth, removeProduct)
router.put("/product/:productId/:userId", requireSignin, isAdmin, isAuth, updateProduct)
router.get('/products', listProducts)
router.get('/products/related/:productId', relatedProducts)

router.param('userId', userById)
router.param('productId', productById)

module.exports = router