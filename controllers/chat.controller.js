const { chat } = require('../services')
const logger = require('../logger')

const chatsList = (req, res) => {
    chat.chatsList({ userId: req.body.decoded.userId })
        .then(chats => {
            logger.debug({ chats })
            res.status(200).send({
                status: 'success',
                chats
            })
        })
        .catch(err => {
            logger.error(err)
            res.status(500).send({
                status: 'error',
                message: 'Error while receiving the list of chats from the db'
            })
        })
}

const messages = (req, res) => {
    chat.messages({ chatId: req.query.chatId })
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
        .then(({ createdAt, chatUsers }) => {
            // req.io.emitSmart(chatUsers, 'new-message', ({
            //     userId: req.body.decoded.userId,
            //     message: req.body.message,
            //     createdAt
            // }))
            req.io.emit('new-message', ({
                userId: req.body.decoded.userId,
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

module.exports = {
    chatsList,
    messages,
    addMessage,
}
