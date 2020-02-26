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

module.exports = {
    chatsList,
    messages,
}
