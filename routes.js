'use strict'

const express = require('express')
const { auth, blockchain } = require('./controllers')
const { verifyToken } = require('./middleware')

const router = express.Router()

router.post('/register', auth.register)
router.get ('/login',    auth.login)

router.get ('/balanceInAddress',  verifyToken, blockchain.balanceInAddress)
router.get ('/balanceInContract', verifyToken, blockchain.balanceInContract)
router.post('/signTransfer',      verifyToken, blockchain.signTransfer)
router.post('/publishTransfer',   verifyToken, blockchain.publishTransfer)

module.exports = router
