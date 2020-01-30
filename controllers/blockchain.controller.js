'use strict'

const { blockchain } = require('../services')
const { verifyToken } = require('../utils/crypto')
const { toEth } = require('../utils/blockchain')
const logger = require('../logger')

const signTransfer = (req, res, next) => {
    console.log(req.decoded)
    // const token = req.body.token
    // verifyToken(token)
    //     .then(decoded =>
    //         res.status(201).send({
    //             status: 'authorized'
    //         }))
    //     .catch(err => {
    //         logger.debug(err)
    //         res.status(401).send({
    //             status: 'unauthorized',
    //             message: 'Invalid token provided'
    //         })
    //     })
}

const balanceInAddress = (req, res) => {
    blockchain.balanceInAddress(req.decoded.userId)
        .then(balance => {
            const balanceInEth = toEth(balance)
            logger.debug(`User balance: ${balanceInEth}`)
            res.status(200).send({
                status: 'success',
                currency: 'ETH',
                balanceInEth
            })
        })
        .catch(err => {
            logger.debug({ err })
            res.sendStatus(500)
        })
}

const balanceInContract = (req, res) => {
    blockchain.balanceInContract(req.decoded.userId)
        .then(balance => {
            const balanceInEth = toEth(balance)
            logger.debug(`User balance: ${balanceInEth}`)
            res.status(200).send({
                status: 'success',
                currency: 'ETH',
                balanceInEth
            })
        })
        .catch(err => {
            logger.debug({ err })
            res.sendStatus(500)
        })
}

module.exports = {
    signTransfer,
    balanceInAddress,
    balanceInContract,
}
