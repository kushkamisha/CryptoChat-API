const express = require('express')
const { auth, bc, chat } = require('./controllers')
const { verifyAppToken } = require('./middleware')

// eslint-disable-next-line new-cap
const r = express.Router()

r.post('/auth/register',       auth.register)
r.post('/auth/login',          auth.login)
r.post('/auth/updateUserData', verifyAppToken, auth.updateUserData)
r.get('/auth/myProfile',       verifyAppToken, auth.myProfile)

r.get('/chat/chatList',        verifyAppToken, chat.chatsList)
r.get('/chat/messages',        verifyAppToken, chat.messages)
r.get('/chat/unreadMessages',  verifyAppToken, chat.unreadMessages)
r.post('/chat/message',        verifyAppToken, chat.addMessage)
r.post('/chat/readMessages',   verifyAppToken, chat.readMessages)

r.get('/bc/balanceInAddress',  verifyAppToken, bc.balanceInAddress)
r.get('/bc/balanceInContract', verifyAppToken, bc.balanceInContract)
r.post('/bc/signTransfer',     verifyAppToken, bc.signTransfer)
r.post('/bc/signTransferByUserId', verifyAppToken,
    bc.signTransferByUserId)
r.get('/bc/verifyTranfer',     verifyAppToken, bc.verifyTransfer)
r.post('/bc/publishTransfer',  verifyAppToken, bc.publishTransfer)
r.get('/bc/transfers',         verifyAppToken, bc.transfers)

module.exports = r
