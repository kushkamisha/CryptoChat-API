'use strict'

const { blockchain } = require('../services')
const { verifyToken } = require('../utils/crypto')
const { toEth } = require('../utils/blockchain')
const logger = require('../logger')

const signTransfer = (req, res, next) => {
    const token = req.body.token
    verifyToken(token)
        .then(decoded =>
            res.status(201).send({
                status: 'authorized'
            }))
        .catch(err => {
            logger.debug(err)
            res.status(401).send({
                status: 'unauthorized',
                message: 'Invalid token provided'
            })
        })
}

const balanceInAddress = (req, res, next) => {
    const token = req.body.token
    verifyToken(token)
        .then(decoded => {
            const userId = decoded.userId
            blockchain.balanceInAddress(userId)
                .then(balance => {
                    const balanceInEth = toEth(balance)
                    logger.debug(`User balance: ${balanceInEth}`)
                    res.status(200).send({
                        status: 'success',
                        currency: 'ETH',
                        balanceInEth
                    })
                })
        })
        .catch(err => {
            logger.debug({ err })
            res.status(401).send({
                status: 'unauthorized',
                message: 'Invalid token provided'
            })
        })
}

const balanceInContract = (req, res, next) => {
    res.sendStatus(501)
}

module.exports = {
    signTransfer,
    balanceInAddress,
    balanceInContract,
}
