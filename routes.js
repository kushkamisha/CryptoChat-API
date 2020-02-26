const express = require('express')
const { auth, blockchain, chat } = require('./controllers')
const { verifyAppToken } = require('./middleware')

// eslint-disable-next-line new-cap
const r = express.Router()

r.post('/auth/register', auth.register)
r.post('/auth/login',    auth.login)

r.get('/chat/chatList',        verifyAppToken, chat.chatsList)
r.get('/chat/messages',        verifyAppToken, chat.messages)

r.get('/bc/balanceInAddress',  verifyAppToken, blockchain.balanceInAddress)
r.get('/bc/balanceInContract', verifyAppToken, blockchain.balanceInContract)
r.post('/bc/signTransfer',     verifyAppToken, blockchain.signTransfer)
r.get('/bc/verifyTranfer',     verifyAppToken, blockchain.verifyTransfer)
r.post('/bc/publishTransfer',  verifyAppToken, blockchain.publishTransfer)

module.exports = r
