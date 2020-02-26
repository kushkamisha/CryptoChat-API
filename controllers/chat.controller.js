const { chat } = require('../services')
const logger = require('../logger')

const home = (req, res) => {
    chat.home({ userId: req.body.decoded.userId })
        .then(chats => {
            logger.debug({ chats })
            res.send({
                status: 'success',
                chats
            })
        })
        .catch(err => {
            logger.error(err)
            res.send({
                status: 'error',
                message: 'Error while receiving the list of chats from the db'
            })
        })
}

module.exports = {
    home,
}
