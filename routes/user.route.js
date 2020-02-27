const express = require('express')
const router = express.Router()

const {
    requireSignin, isAdmin, isAuth
} = require('../controllers/auth.controller')
const { userById } = require('../controllers/user.controller')

router.get('/secret/:userId', requireSignin, (req, res) => {
    res.json({
        user: req.profile
    })
})
router.param('userId', userById)

module.exports = router