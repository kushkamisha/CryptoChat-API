const { chat } = require('../services')
const logger = require('../logger')

const home = (req, res, next) => {
    chat.home({
        io: req.app.get('socketio'),
        userId: req.body.decoded.userId
    })
        // .then(() => {

        //     next()
        // })
        // .catch(err => {
        //     logger.error({ err })
        //     res.sendStatus(500)
        // })
}

module.exports = {
    home,
}
