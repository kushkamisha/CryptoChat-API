'use strict'

const { auth } = require('../services')
const logger = require('../logger')

const register = (req, res, next) => new Promise((resolve, reject) => {
    auth.register(req.body)
        .then(result => {
            logger.info(result)
            res.sendStatus(201)
            next()
        })
        .catch(err => {
            console.error({ err })
            res.sendStatus(500) && next(console.error(err))
        })
})

// const login = 

module.exports = {
    register
}
