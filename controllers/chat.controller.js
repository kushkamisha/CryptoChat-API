const { chat } = require('../services')

const chatsList = (req, res) => {
    chat.chatsList({ userId: req.body.decoded.userId })
        .then(chats => {
            res.status(200).send({
                status: 'success',
                chats
            })
        })
        .catch(err => {
            console.error(err)
            res.status(500).send({
                status: 'error',
                message: 'Error while receiving the list of chats from the db'
            })
        })
}

const messages = (req, res) => {
    chat.messages(req.query.chatId)
        .then(messages => {
            res.status(200).send({
                status: 'success',
                messages
            })
        })
        .catch(err => {
            console.error(err)
            res.status(500).send({
                status: 'error',
                message: 'Error with reading chat messages from the db'
            })
        })
}

const unreadMessages = (req, res) => {
    chat.unreadMessages(req.query.chatId, req.query.userId)
        .then(messages => {
            res.status(200).send({
                status: 'success',
                messages
            })
        })
        .catch(err => {
            console.error(err)
            res.status(500).send({
                status: 'error',
                message: 'Error with reading chat messages from the db'
            })
        })
}

const addMessage = (req, res) => {
    chat.addMessage({
        chatId: req.body.chatId,
        userId: req.body.decoded.userId,
        text: req.body.message
    })
        .then(({ chatMsgId, createdAt, chatUsers }) => {
            // req.io.emitSmart(chatUsers, 'new-message', ({
            //     userId: req.body.decoded.userId,
            //     message: req.body.message,
            //     createdAt
            // }))
            console.log({ chatMsgId })
            req.io.emit('new-message', ({
                msgId: chatMsgId,
                userId: req.body.decoded.userId,
                chatId: req.body.chatId,
                message: req.body.message,
                createdAt
            }))
            res.status(200).send({
                status: 'success',
                createdAt
            })
        })
        .catch(err => {
            console.error(err)
            res.status(500).send({
                status: 'error',
                message: 'Error with adding a new message to the db'
            })
        })
}

const readMessages = (req, res) =>
    chat.readMessages(req.body.chatId, req.body.decoded.userId)
        .then(res.status(200).send({ status: 'success' }))
        .catch(err => {
            console.error(err)
            res.status(500).send({
                status: 'error',
                message: 'Error with updating messages status'
            })
        })

module.exports = {
    chatsList,
    messages,
    unreadMessages,
    addMessage,
    readMessages,
}
