'use strict'

const express = require('express')
const { auth } = require('../controllers')

const router = express.Router()

router.post('/register', auth.register)
router.get('/login', auth.login)
router.post('/signTransfer', auth.signTransfer)

module.exports = router
