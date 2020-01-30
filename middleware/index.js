'use strict'

const logger = require('../logger')
const crypto = require('../utils/crypto')

const verifyToken = (req, res, next) => {
    const token = req.body.token
    crypto.verifyToken(token)
        .then(decoded => {
            req.decoded = decoded
            next()
        })
        .catch(err => {
            logger.debug({ err })
            res.status(401).send({
                status: 'unauthorized',
                message: 'Invalid token provided'
            })
        })
}

module.exports = {
    verifyToken,
}