'use strict'

const express = require('express')
const { auth } = require('../controllers')

const router = express.Router()

router.post('/register', auth.register)

module.exports = router
