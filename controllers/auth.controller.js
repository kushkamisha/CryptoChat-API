'use strict'

const jwt = require('jsonwebtoken')
const { auth } = require('../services')
const { jwtKey } = require('../config')
const logger = require('../logger')

const register = (req, res, next) => new Promise((resolve, reject) => {
    const {
        email, pass, firstName, middleName, lastName, birthDate,
        keywords, description
    } = req.body

    // birthDate must be in format yyyy-mm-dd

    auth.register(
        email, pass, firstName, middleName, lastName, birthDate,
        keywords, description
    )
        .then(result => {
            logger.info(`Register result: ${result}`)
            res.sendStatus(201)
            next()
        })
        .catch(err => {
            console.error({ err })
            res.sendStatus(500) && next(console.error(err))
        })
})

const login = (req, res, next) => new Promise((resolve, reject) => {
    auth.login(req.body)
        .then(userId => {
            logger.info(`Login result (user id): ${userId}`)

            if (userId) {
                // Generate a token for the user
                jwt.sign({ userId }, jwtKey,
                    { expiresIn: '18h' }, (err, token) => {
                        if (err) throw err
                        logger.debug(`JWT token: ${token}`)

                        res.status(200).send({
                            status: 'success',
                            jwt: token
                        })
                    })
            } else res.status(401).send({
                status: 'error',
                message: 'Your email or password is incorrect'
            })

            next()
        })
        .catch(err => {
            logger.error({ err })
            res.sendStatus(500)
        })
})

const signTransfer = (req, res, next) => {
    logger.debug(req.body)
    const token = req.body.token
    jwt.verify(token, jwtKey, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                status: 'unauthorized',
                message: 'Invalid token provided'
            })
        }
        logger.debug({ decoded })
        res.status(201).send({
            status: 'authorized'
        })
    })
}

module.exports = {
    register,
    login,
    signTransfer,
}
