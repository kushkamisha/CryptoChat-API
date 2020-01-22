'use strict'

const express = require('express')
const { auth, blockchain } = require('../controllers')

const router = express.Router()

router.post('/register', auth.register)
router.get('/login', auth.login)

router.get('/balanceInAddress', blockchain.balanceInAddress)
router.get('/balanceInContract', blockchain.balanceInContract)
router.post('/signTransfer', blockchain.signTransfer)

module.exports = router
