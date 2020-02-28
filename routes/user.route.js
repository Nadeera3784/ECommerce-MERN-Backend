const express = require('express')
const router = express.Router()

const {
    requireSignin,
    isAdmin,
    isAuth
} = require('../controllers/auth.controller')
const {
    userById,
    readProfile,
    updateProfile
} = require('../controllers/user.controller')

router.get('/secret/:userId', requireSignin, (req, res) => {
    res.json({
        user: req.profile
    })
})

router.get('/user/:userId', requireSignin, isAuth, readProfile)
router.put('/user/:userId', requireSignin, isAuth, updateProfile)
router.param('userId', userById)

module.exports = router