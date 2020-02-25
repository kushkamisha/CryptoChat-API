const logger = require('../logger')

const home = ({ io, userId }) => {
    logger.debug({ io, userId })
    io
}

module.exports = {
    home,
}
